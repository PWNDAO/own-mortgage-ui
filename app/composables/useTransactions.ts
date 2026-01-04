import to from '@/lib/await-to-js'
import type { Abi, ContractFunctionArgs, ContractFunctionName, TransactionReceipt } from 'viem'
import { getAccount, getBlockNumber, getPublicClient, getTransaction, getTransactionReceipt, switchChain, waitForTransactionReceipt, watchContractEvent, writeContract } from '@wagmi/core/actions'
import type { WriteContractVariables } from '@wagmi/core/query'
import type { AnyFunction, IntervalId } from '@/typing/customTypes'
import type { ToastStep } from '~/components/ui/toast/useToastsStore'
import { wagmiConfig, type WagmiConfig } from '~/config/appkit'
import { SAFE_WALLET_ABI } from '~/assets/abis/SafeWalletAbi'
import { useConnectedAccountTypeStore } from './useConnectedAccountTypeStore'


export interface SendTransactionHooks {
  onWriteContractSuccess?: AnyFunction
  onTxConfirmSuccess?: AnyFunction
  onWriteContractError?: AnyFunction
  onTxConfirmError?: AnyFunction
}

export interface SendTransactionOptions {
  hooks?: SendTransactionHooks
  step?: ToastStep
}

export async function sendTransaction<
  const TAbi extends Abi,
  TFunctionName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>,
  TArgs extends ContractFunctionArgs<TAbi, 'nonpayable' | 'payable', TFunctionName>
>(
  transaction: WriteContractVariables<TAbi, TFunctionName, TArgs, WagmiConfig, WagmiConfig['chains'][number]['id']>,
  { hooks, step }: SendTransactionOptions = {},
): Promise<TransactionReceipt> {
  console.log('Starting to send a transaction with following parameters:')
  console.log(transaction)

  const connectedChainId = getAccount(wagmiConfig).chainId
  console.log(`connectedChainId=${connectedChainId}; transaction.chainId=${transaction.chainId}`)

  if (connectedChainId !== transaction.chainId) {
    console.log(`Switching chain from ${connectedChainId} to ${transaction.chainId}.`)
    const switchedChain = await switchChain(wagmiConfig, { chainId: transaction.chainId! })
    if (switchedChain.id !== transaction.chainId) {
      throw new Error('User denied switching chains before sending a tx.')
    }
  }

  // note: if signing with a Safe{Wallet}, the txHash is safeTxHash and not the real txHash
  const [writeTxError, txHash] = await to(writeContract(wagmiConfig, transaction))
  if (writeTxError || !txHash) {
    if (hooks?.onWriteContractError) {
      hooks.onWriteContractError()
    }
    throw writeTxError
  }

  console.log(`Transaction hash: ${txHash}`)
  if (hooks?.onWriteContractSuccess) {
    hooks.onWriteContractSuccess()
  }

  // if safeThreshold is truthy, it means we are signing with a Safe{Wallet} in which case the
  //  txHash is safeTxHash and not the real txHash
  // in the following block, if we passed `step`, we are checking here if the txHash exists
  //  and if yes, we assign it to the step.txHash
  if (step && !useConnectedAccountTypeStore().safeThreshold) {
    try {
      await getTransaction(wagmiConfig, {
        hash: txHash,
        chainId: transaction.chainId,
      })
      step.txHash = txHash
      // eslint-disable-next-line
    } catch (error) { }
  }

  let txReceipt: TransactionReceipt | undefined
  let confirmTxError: Error | null = null
  if (useConnectedAccountTypeStore().isConnectedContractWallet) {
    const contractWalletAddress = getAccount(wagmiConfig).address!

    txReceipt = await new Promise<TransactionReceipt>((resolve) => {
      const contractEventParameters = {
        abi: SAFE_WALLET_ABI,
        address: contractWalletAddress,
        eventName: 'ExecutionSuccess',
        chainId: transaction.chainId,
      } as const

      const unwatch = watchContractEvent(wagmiConfig, {
        ...contractEventParameters,

        async onLogs(logs) {
          console.log('Received following logs from the contract wallet: ')
          console.log(logs)

          // note: we also check for topics[1] === txHash because in some cases the log.args are undefined (not sure why)
          const log = logs.find(_log => _log.args?.txHash === txHash || _log.transactionHash === txHash || _log.topics?.[1] === txHash)
          if (!log) {
            console.log(`No log with corresponding transaction hash (${txHash}) found.`)
            return
          }

          if (step && !step.txHash) {
            step.txHash = log.transactionHash
          }

          unwatch()
          const txReceipt = await getTransactionReceipt(wagmiConfig, { hash: log.transactionHash, chainId: transaction.chainId })
          console.log('Contract wallet has successfully executed a transaction!')
          resolve(txReceipt)
        },
      })
      console.log(`Waiting for ExecutionSuccess event on contract wallet on address=${contractWalletAddress} and chain ID=${transaction.chainId}.`)

      // it can also happen that the tx event already happened before setting up a watched, so we need to also
      // look at past X blocks to see if the event is there
      getBlockNumber(wagmiConfig, { chainId: transaction.chainId })
        .then(currentBlockNumber => {
          return getPublicClient(wagmiConfig, { chainId: transaction.chainId! })!.getContractEvents({
            ...contractEventParameters,
            fromBlock: currentBlockNumber - 500n,
          })
        }).then(logs => {
          // note: we also check for topics[1] === txHash because in some cases the log.args are undefined (not sure why)
          const log = logs.find(_log => _log.args?.txHash === txHash || _log.transactionHash === txHash || _log.topics?.[1] === txHash)
          if (!log) {
            console.log(`No log with corresponding transaction hash (${txHash}) found in the past blocks.`)
            return
          }

          console.log('Found a corresponding event from a transaction execution in the past blocks.')
          console.log(log)

          if (step && !step.txHash) {
            step.txHash = log.transactionHash
          }

          unwatch()
          return getTransactionReceipt(wagmiConfig, { hash: log.transactionHash, chainId: transaction.chainId })
        }).then(txReceipt => {
          if (txReceipt) {
            console.log('Contract wallet has successfully executed a transaction!')
            resolve(txReceipt)
          }
        }).catch(err => {
          console.error('Error while getting a past safe wallet ExecutionSuccess events.')
          console.error(err)
        })
    })
  } else {
    let intervalId: IntervalId | undefined
    if (step) {
      const TOO_LONG_TIME = 30000
      const INTERVAL_TIME = 500
      let elapsedTime = 0
      intervalId = setInterval(() => {
        if (elapsedTime >= TOO_LONG_TIME) {
          step.isRunningLong = true
        }
        elapsedTime += INTERVAL_TIME
      }, INTERVAL_TIME)
    }

    [confirmTxError, txReceipt] = await to(waitForTransactionReceipt(wagmiConfig, { hash: txHash, chainId: transaction.chainId, retryCount: 10 }))

    if (intervalId !== undefined) {
      clearInterval(intervalId)
      if (step?.isRunningLong) {
        step.isRunningLong = false
      }
    }
  }

  if (confirmTxError || !txReceipt) {
    if (hooks?.onTxConfirmError) {
      hooks.onTxConfirmError()
    }
    throw confirmTxError
  }

  console.log('Tx receipt: ')
  console.log(txReceipt)

  if (hooks?.onTxConfirmSuccess) {
    hooks.onTxConfirmSuccess()
  }

  return txReceipt
}
