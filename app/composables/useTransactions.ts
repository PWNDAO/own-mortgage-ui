import to from '@/lib/await-to-js'
import type { Abi, ContractFunctionArgs, ContractFunctionName, TransactionReceipt } from 'viem'
// TODO is it fine to import from @wagmi/core/actions instead of @wagmi/vue/actions?
import { getAccount, getBlockNumber, getCallsStatus, getPublicClient, getTransaction, getTransactionReceipt, sendCalls, switchChain, waitForTransactionReceipt, watchContractEvent, writeContract } from '@wagmi/core/actions'
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

export interface BatchCall {
  to: `0x${string}`
  data: `0x${string}`
  value?: bigint
}

export interface SendBatchTransactionOptions {
  hooks?: SendTransactionHooks
  steps?: ToastStep[]
  chainId: WagmiConfig['chains'][number]['id']
}

// TODO change type of transaction parameter to always have chainId filled, right now it's marked as optional
//  and also allows undefined value, which we should not allow
export async function sendTransaction<
  const TAbi extends Abi,
  TFunctionName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>,
  TArgs extends ContractFunctionArgs<TAbi, 'nonpayable' | 'payable', TFunctionName>
>(
  transaction: WriteContractVariables<TAbi, TFunctionName, TArgs, WagmiConfig, WagmiConfig['chains'][number]['id']>,
  { hooks, step }: SendTransactionOptions = {},
): Promise<TransactionReceipt> {
  // console.log('Starting to send a transaction with following parameters:')
  // console.log(transaction)

  const connectedChainId = getAccount(wagmiConfig).chainId
  console.log(`connectedChainId=${connectedChainId}; transaction.chainId=${transaction.chainId}`)

  if (connectedChainId !== transaction.chainId) {
    // console.log(`Switching chain from ${connectedChainId} to ${transaction.chainId}.`)
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
    } catch (error) {}
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

/**
 * Send a batch of transactions using wagmi's sendCalls (EIP-5792)
 * This function integrates with toast steps and handles chain switching, Safe wallets, etc.
 * 
 * @param calls - Array of calls to batch together
 * @param options - Configuration options including hooks, steps (one per call), and chainId
 * @returns Transaction receipt for the batched transaction
 */
export async function sendBatchTransaction(
  calls: BatchCall[],
  { hooks, steps, chainId }: SendBatchTransactionOptions,
): Promise<TransactionReceipt> {
  console.log('Starting to send batch transaction with following calls:')
  console.log(calls)

  const connectedChainId = getAccount(wagmiConfig).chainId
  console.log(`connectedChainId=${connectedChainId}; target chainId=${chainId}`)

  if (connectedChainId !== chainId) {
    console.log(`Switching chain from ${connectedChainId} to ${chainId}.`)
    const switchedChain = await switchChain(wagmiConfig, { chainId })
    if (switchedChain.id !== chainId) {
      throw new Error('User denied switching chains before sending batch tx.')
    }
  }

  // Send batched calls using EIP-5792
  const [sendCallsError, batchResult] = await to(
    sendCalls(wagmiConfig, {
      calls,
      chainId,
    })
  )

  if (sendCallsError || !batchResult) {
    if (hooks?.onWriteContractError) {
      hooks.onWriteContractError()
    }
    throw sendCallsError
  }

  const batchId = batchResult.id
  console.log(`Batch transaction ID: ${batchId}`)
  if (hooks?.onWriteContractSuccess) {
    hooks.onWriteContractSuccess()
  }

  // Mark all steps as batched and set the same txHash
  if (steps) {
    for (const step of steps) {
      step.isBatched = true
      step.txHash = batchId as `0x${string}`
    }
  }

  // For Safe wallets, we need to watch for ExecutionSuccess event
  let txReceipt: TransactionReceipt | undefined
  let confirmTxError: Error | null = null
  
  if (useConnectedAccountTypeStore().isConnectedContractWallet) {
    const contractWalletAddress = getAccount(wagmiConfig).address!

    txReceipt = await new Promise<TransactionReceipt>((resolve) => {
      const contractEventParameters = {
        abi: SAFE_WALLET_ABI,
        address: contractWalletAddress,
        eventName: 'ExecutionSuccess',
        chainId,
      } as const

      const unwatch = watchContractEvent(wagmiConfig, {
        ...contractEventParameters,
         
        async onLogs(logs) {
          console.log('Received following logs from the contract wallet (batch): ')
          console.log(logs)

          const log = logs.find(_log => _log.args?.txHash === batchId || _log.transactionHash === batchId || _log.topics?.[1] === batchId)
          if (!log) {
            console.log(`No log with corresponding batch ID (${batchId}) found.`)
            return
          }

          // Update all steps with the actual transaction hash
          if (steps) {
            for (const step of steps) {
              if (!step.txHash || step.txHash === batchId) {
                step.txHash = log.transactionHash
              }
            }
          }

          unwatch()
          const txReceipt = await getTransactionReceipt(wagmiConfig, { hash: log.transactionHash, chainId })
          console.log('Contract wallet has successfully executed batch transaction!')
          resolve(txReceipt)
        },
      })
      console.log(`Waiting for ExecutionSuccess event on contract wallet on address=${contractWalletAddress} and chain ID=${chainId}.`)

      // Check past blocks for the event
      getBlockNumber(wagmiConfig, { chainId })
        .then(currentBlockNumber => {
          return getPublicClient(wagmiConfig, { chainId })!.getContractEvents({
            ...contractEventParameters,
            fromBlock: currentBlockNumber - 500n,
          })
        }).then(logs => {
          const log = logs.find(_log => _log.args?.txHash === batchId || _log.transactionHash === batchId || _log.topics?.[1] === batchId)
          if (!log) {
            console.log(`No log with corresponding batch ID (${batchId}) found in past blocks.`)
            return
          }

          console.log('Found corresponding batch event from past blocks.')
          console.log(log)

          if (steps) {
            for (const step of steps) {
              if (!step.txHash || step.txHash === batchId) {
                step.txHash = log.transactionHash
              }
            }
          }

          unwatch()
          return getTransactionReceipt(wagmiConfig, { hash: log.transactionHash, chainId })
        }).then(txReceipt => {
          if (txReceipt) {
            console.log('Contract wallet has successfully executed batch transaction!')
            resolve(txReceipt)
          }
        }).catch(err => {
          console.error('Error while getting past safe wallet ExecutionSuccess events for batch.')
          console.error(err)
        })
    })
  } else {
    // For regular wallets, wait for the batch transaction receipt
    let intervalId: IntervalId | undefined
    if (steps && steps.length > 0) {
      const TOO_LONG_TIME = 30000
      const INTERVAL_TIME = 500
      let elapsedTime = 0
      intervalId = setInterval(() => {
        if (elapsedTime >= TOO_LONG_TIME) {
          // Mark all steps as running long
          steps.forEach(step => {
            step.isRunningLong = true
          })
        }
        elapsedTime += INTERVAL_TIME
      }, INTERVAL_TIME)
    }

    // Poll for batch call status using EIP-5792
    console.log(`[sendBatchTransaction] Polling for batch call status...`)
    let actualTxHash: `0x${string}` | undefined
    
    while (!actualTxHash) {
      try {
        const callsStatus = await getCallsStatus(wagmiConfig, { 
          id: batchId,
        })
        
        console.log(`[sendBatchTransaction] Batch status:`, callsStatus.status)
        
        if (callsStatus.status === 'success') {
          // Get the actual transaction hash from receipts
          if (callsStatus.receipts && callsStatus.receipts.length > 0 && callsStatus.receipts[0]) {
            actualTxHash = callsStatus.receipts[0].transactionHash as `0x${string}`
            console.log(`[sendBatchTransaction] Batch confirmed! Tx hash: ${actualTxHash}`)
            
            // Update all steps with the actual transaction hash
            if (steps) {
              steps.forEach(step => {
                step.txHash = actualTxHash
              })
            }
            break
          }
        } else if (callsStatus.status === 'pending') {
          // Still pending, wait and poll again
          await new Promise(resolve => setTimeout(resolve, 1000))
        } else {
          // Error or other status
          throw new Error(`Batch call failed with status: ${callsStatus.status}`)
        }
      } catch (error) {
        console.error('[sendBatchTransaction] Error checking batch status:', error)
        // If getCallsStatus fails, fallback to trying to wait for the batchId as a transaction hash
        // This handles wallets that might return a transaction hash directly instead of a batch ID
        try {
          console.log(`[sendBatchTransaction] Fallback: trying to wait for batchId as transaction hash`)
          actualTxHash = batchId as `0x${string}`
          break
        } catch (fallbackError) {
          throw error
        }
      }
    }

    // Now wait for the actual transaction receipt
    [confirmTxError, txReceipt] = await to(
      waitForTransactionReceipt(wagmiConfig, { 
        hash: actualTxHash!, 
        chainId, 
        retryCount: 10 
      })
    )

    if (intervalId !== undefined) {
      clearInterval(intervalId)
      if (steps) {
        steps.forEach(step => {
          if (step.isRunningLong) {
            step.isRunningLong = false
          }
        })
      }
    }
  }

  if (confirmTxError || !txReceipt) {
    if (hooks?.onTxConfirmError) {
      hooks.onTxConfirmError()
    }
    throw confirmTxError
  }

  console.log('Batch tx receipt: ')
  console.log(txReceipt)

  if (hooks?.onTxConfirmSuccess) {
    hooks.onTxConfirmSuccess()
  }

  return txReceipt
}
 
