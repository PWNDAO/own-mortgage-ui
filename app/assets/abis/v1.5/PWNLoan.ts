export const PWN_LOAN_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_loanToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_config",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_categoryRegistry",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "addr",
                "type": "address"
            }
        ],
        "name": "AcceptorIsProposer",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "CallerNotBorrower",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "CallerNotLOANTokenHolder",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "CallerNotVault",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "DefaultedOnCreation",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "HookZeroAddress",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "IncompleteTransfer",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "expected",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "current",
                "type": "bytes32"
            }
        ],
        "name": "InvalidHookReturnValue",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "category",
                "type": "uint8"
            },
            {
                "internalType": "address",
                "name": "addr",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "InvalidMultiTokenAsset",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "current",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "expected",
                "type": "bytes32"
            }
        ],
        "name": "InvalidProposerSpecHash",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "current",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "limit",
                "type": "uint256"
            }
        ],
        "name": "InvalidRepaymentAmount",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "signer",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "digest",
                "type": "bytes32"
            }
        ],
        "name": "InvalidSignature",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "length",
                "type": "uint256"
            }
        ],
        "name": "InvalidSignatureLength",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            }
        ],
        "name": "LoanContextLocked",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "LoanNotDefaulted",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "LoanNotRunning",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "NothingToClaim",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "categoryValue",
                "type": "uint8"
            }
        ],
        "name": "UnsupportedCategory",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "UnsupportedTransferFunction",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "addr",
                "type": "address"
            }
        ],
        "name": "VaultTransferSameSourceAndDestination",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "ZeroPrincipal",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "proposalHash",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "product",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "bool",
                        "name": "isProposerLender",
                        "type": "bool"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "proposerSpecHash",
                        "type": "bytes32"
                    },
                    {
                        "components": [
                            {
                                "internalType": "enum MultiToken.Category",
                                "name": "category",
                                "type": "uint8"
                            },
                            {
                                "internalType": "address",
                                "name": "assetAddress",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "id",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct MultiToken.Asset",
                        "name": "collateral",
                        "type": "tuple"
                    },
                    {
                        "internalType": "address",
                        "name": "creditAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "principal",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct LoanTerms",
                "name": "terms",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "contract IPWNLenderCreateHook",
                        "name": "createHook",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "createHookData",
                        "type": "bytes"
                    },
                    {
                        "internalType": "contract IPWNLenderRepaymentHook",
                        "name": "repaymentHook",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "repaymentHookData",
                        "type": "bytes"
                    }
                ],
                "indexed": false,
                "internalType": "struct PWNLoan.LenderSpec",
                "name": "lenderSpec",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "contract IPWNBorrowerCreateHook",
                        "name": "createHook",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "createHookData",
                        "type": "bytes"
                    }
                ],
                "indexed": false,
                "internalType": "struct PWNLoan.BorrowerSpec",
                "name": "borrowerSpec",
                "type": "tuple"
            },
            {
                "indexed": false,
                "internalType": "bytes",
                "name": "extra",
                "type": "bytes"
            }
        ],
        "name": "LOANCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "liquidator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "liquidationAmount",
                "type": "uint256"
            }
        ],
        "name": "LOANLiquidated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "repaymentAmount",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "newPrincipal",
                "type": "uint256"
            }
        ],
        "name": "LOANRepaid",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "claimedAmount",
                "type": "uint256"
            }
        ],
        "name": "LOANRepaymentClaimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "multiproposalHash",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "proposer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "multiproposalMerkleRoot",
                "type": "bytes32"
            }
        ],
        "name": "MultiproposalAcceptable",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "multiproposalHash",
                "type": "bytes32"
            }
        ],
        "name": "MultiproposalUnacceptable",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "proposalHash",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "proposer",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "proposalModule",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bytes",
                "name": "proposal",
                "type": "bytes"
            }
        ],
        "name": "ProposalAcceptable",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "proposalHash",
                "type": "bytes32"
            }
        ],
        "name": "ProposalUnacceptable",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "enum MultiToken.Category",
                        "name": "category",
                        "type": "uint8"
                    },
                    {
                        "internalType": "address",
                        "name": "assetAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct MultiToken.Asset",
                "name": "asset",
                "type": "tuple"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "origin",
                "type": "address"
            }
        ],
        "name": "VaultPull",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "enum MultiToken.Category",
                        "name": "category",
                        "type": "uint8"
                    },
                    {
                        "internalType": "address",
                        "name": "assetAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct MultiToken.Asset",
                "name": "asset",
                "type": "tuple"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "beneficiary",
                "type": "address"
            }
        ],
        "name": "VaultPush",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "enum MultiToken.Category",
                        "name": "category",
                        "type": "uint8"
                    },
                    {
                        "internalType": "address",
                        "name": "assetAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct MultiToken.Asset",
                "name": "asset",
                "type": "tuple"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "origin",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "beneficiary",
                "type": "address"
            }
        ],
        "name": "VaultPushFrom",
        "type": "event"
    },
    {
        "inputs": [

        ],
        "name": "EIP712DOMAIN_TYPEHASH",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "MULTIPROPOSAL_DOMAIN_SEPARATOR",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "MULTIPROPOSAL_TYPEHASH",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "VERSION",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "categoryRegistry",
        "outputs": [
            {
                "internalType": "contract IMultiTokenCategoryRegistry",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            }
        ],
        "name": "claimRepayment",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "config",
        "outputs": [
            {
                "internalType": "contract PWNConfig",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "proposer",
                        "type": "address"
                    },
                    {
                        "internalType": "contract IPWNProduct",
                        "name": "product",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "proposalData",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes32[]",
                        "name": "proposalInclusionProof",
                        "type": "bytes32[]"
                    },
                    {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct PWNLoan.ProposalSpec",
                "name": "proposalSpec",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "contract IPWNLenderCreateHook",
                        "name": "createHook",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "createHookData",
                        "type": "bytes"
                    },
                    {
                        "internalType": "contract IPWNLenderRepaymentHook",
                        "name": "repaymentHook",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "repaymentHookData",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct PWNLoan.LenderSpec",
                "name": "lenderSpec",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "contract IPWNBorrowerCreateHook",
                        "name": "createHook",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "createHookData",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct PWNLoan.BorrowerSpec",
                "name": "borrowerSpec",
                "type": "tuple"
            },
            {
                "internalType": "bytes",
                "name": "extra",
                "type": "bytes"
            }
        ],
        "name": "create",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "contract IPWNBorrowerCreateHook",
                        "name": "createHook",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "createHookData",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct PWNLoan.BorrowerSpec",
                "name": "borrowerSpec",
                "type": "tuple"
            }
        ],
        "name": "getBorrowerSpecHash",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            }
        ],
        "name": "getLOAN",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "borrower",
                        "type": "address"
                    },
                    {
                        "internalType": "uint40",
                        "name": "lastUpdateTimestamp",
                        "type": "uint40"
                    },
                    {
                        "components": [
                            {
                                "internalType": "enum MultiToken.Category",
                                "name": "category",
                                "type": "uint8"
                            },
                            {
                                "internalType": "address",
                                "name": "assetAddress",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "id",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct MultiToken.Asset",
                        "name": "collateral",
                        "type": "tuple"
                    },
                    {
                        "internalType": "address",
                        "name": "creditAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "principal",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "pastAccruedInterest",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "unclaimedRepayment",
                        "type": "uint256"
                    },
                    {
                        "internalType": "contract IPWNProduct",
                        "name": "product",
                        "type": "address"
                    }
                ],
                "internalType": "struct PWNLoan.LOAN",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            }
        ],
        "name": "getLOANDebt",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            }
        ],
        "name": "getLOANStatus",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "contract IPWNLenderCreateHook",
                        "name": "createHook",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "createHookData",
                        "type": "bytes"
                    },
                    {
                        "internalType": "contract IPWNLenderRepaymentHook",
                        "name": "repaymentHook",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "repaymentHookData",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct PWNLoan.LenderSpec",
                "name": "lenderSpec",
                "type": "tuple"
            }
        ],
        "name": "getLenderSpecHash",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getStateFingerprint",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "multiproposalMerkleRoot",
                        "type": "bytes32"
                    }
                ],
                "internalType": "struct PWNProposalManager.Multiproposal",
                "name": "multiproposal",
                "type": "tuple"
            }
        ],
        "name": "hashMultiproposal",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract IPWNProposalModule",
                "name": "proposalModule",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "proposalData",
                "type": "bytes"
            }
        ],
        "name": "hashProposal",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "proposalHash",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "isMultiproposalAcceptable",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "isProposalAcceptable",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "enum MultiToken.Category",
                        "name": "category",
                        "type": "uint8"
                    },
                    {
                        "internalType": "address",
                        "name": "assetAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct MultiToken.Asset",
                "name": "asset",
                "type": "tuple"
            }
        ],
        "name": "isValidAsset",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "lenderRepaymentHook",
        "outputs": [
            {
                "internalType": "contract IPWNLenderRepaymentHook",
                "name": "hook",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "liquidationData",
                "type": "bytes"
            }
        ],
        "name": "liquidate",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "loanLock",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "loanMetadataUri",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "loanToken",
        "outputs": [
            {
                "internalType": "contract PWNLOAN",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "multiproposalMerkleRoot",
                        "type": "bytes32"
                    }
                ],
                "internalType": "struct PWNProposalManager.Multiproposal",
                "name": "multiproposal",
                "type": "tuple"
            }
        ],
        "name": "makeMultiproposalAcceptable",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "multiproposalHash",
                "type": "bytes32"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "multiproposalHash",
                "type": "bytes32"
            }
        ],
        "name": "makeMultiproposalUnacceptable",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract IPWNProposalModule",
                "name": "proposalModule",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "proposalData",
                "type": "bytes"
            }
        ],
        "name": "makeProposalAcceptable",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "proposalHash",
                "type": "bytes32"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "proposalHash",
                "type": "bytes32"
            }
        ],
        "name": "makeProposalUnacceptable",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "name": "onERC1155BatchReceived",
        "outputs": [
            {
                "internalType": "bytes4",
                "name": "",
                "type": "bytes4"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "name": "onERC1155Received",
        "outputs": [
            {
                "internalType": "bytes4",
                "name": "",
                "type": "bytes4"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "name": "onERC721Received",
        "outputs": [
            {
                "internalType": "bytes4",
                "name": "",
                "type": "bytes4"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "repaymentAmount",
                "type": "uint256"
            }
        ],
        "name": "repay",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            },
            {
                "internalType": "contract IPWNBorrowerCollateralRepaymentHook",
                "name": "borrowerHook",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "borrowerHookData",
                "type": "bytes"
            }
        ],
        "name": "repayWithCollateral",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "contract IPWNLenderRepaymentHook",
                        "name": "hook",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct PWNLoan.LenderRepaymentHookData",
                "name": "hookData",
                "type": "tuple"
            },
            {
                "internalType": "address",
                "name": "repaymentOrigin",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "loanOwner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "creditAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "repaymentAmount",
                "type": "uint256"
            }
        ],
        "name": "tryCallLenderRepaymentHook",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            },
            {
                "internalType": "contract IPWNLenderRepaymentHook",
                "name": "newHook",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "newHookData",
                "type": "bytes"
            }
        ],
        "name": "updateLenderRepaymentHook",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;

export default PWN_LOAN_ABI;