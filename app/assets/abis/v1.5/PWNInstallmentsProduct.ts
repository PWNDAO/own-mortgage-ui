export const PWN_INSTALLMENTS_PRODUCT_ABI = [
    {
        "inputs": [
            {
                "internalType": "contract PWNHub",
                "name": "_hub",
                "type": "address"
            },
            {
                "internalType": "contract PWNRevokedNonce",
                "name": "_revokedNonce",
                "type": "address"
            },
            {
                "internalType": "contract PWNUtilizedCredit",
                "name": "_utilizedCredit",
                "type": "address"
            },
            {
                "internalType": "contract IChainlinkFeedRegistryLike",
                "name": "_chainlinkFeedRegistry",
                "type": "address"
            },
            {
                "internalType": "contract IChainlinkAggregatorLike",
                "name": "_chainlinkL2SequencerUptimeFeed",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_weth",
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
            },
            {
                "internalType": "bytes32",
                "name": "tag",
                "type": "bytes32"
            }
        ],
        "name": "AddressMissingHubTag",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "caller",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "loanContract",
                "type": "address"
            }
        ],
        "name": "CallerNotLoanContract",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "feed",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "updatedAt",
                "type": "uint256"
            }
        ],
        "name": "ChainlinkFeedPriceTooOld",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "feed",
                "type": "address"
            },
            {
                "internalType": "int256",
                "name": "price",
                "type": "int256"
            },
            {
                "internalType": "uint256",
                "name": "updatedAt",
                "type": "uint256"
            }
        ],
        "name": "ChainlinkFeedReturnedNegativePrice",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "ChainlinkInvalidInputLenghts",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "DurationTooShort",
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
                "name": "expiration",
                "type": "uint256"
            }
        ],
        "name": "Expired",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "timeSinceUp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "gracePeriod",
                "type": "uint256"
            }
        ],
        "name": "GracePeriodNotOver",
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
        "name": "InsufficientCreditAmount",
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
        "name": "IntermediaryDenominationsOutOfBounds",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "InvalidLoanToValue",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "L2SequencerDown",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "LiquidationDataNotEmpty",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "liquidator",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "loanContract",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            }
        ],
        "name": "LiquidatorNotLoanOwner",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "LoanNotInitialized",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "LoanToValueZero",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "MinCreditAmountNotSet",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "addr",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "nonceSpace",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "nonce",
                "type": "uint256"
            }
        ],
        "name": "NonceNotUsable",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "PostponementBiggerThanDuration",
        "type": "error"
    },
    {
        "inputs": [

        ],
        "name": "APR_DECIMALS",
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

        ],
        "name": "DEBT_LIMIT_TANGENT_DECIMALS",
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

        ],
        "name": "DOMAIN_SEPARATOR",
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
        "name": "LOAN_TO_VALUE_DECIMALS",
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

        ],
        "name": "MAX_INTERMEDIARY_DENOMINATIONS",
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

        ],
        "name": "MIN_DURATION",
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

        ],
        "name": "NAME",
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
        "name": "PROPOSAL_TYPEHASH",
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
            {
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "proposer",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "proposalData",
                "type": "bytes"
            }
        ],
        "name": "acceptProposal",
        "outputs": [
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
                "internalType": "struct LoanTerms",
                "name": "loanTerms",
                "type": "tuple"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "proposalData",
                "type": "bytes"
            }
        ],
        "name": "decodeProposalData",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "collateralAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "creditAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "address[]",
                        "name": "feedIntermediaryDenominations",
                        "type": "address[]"
                    },
                    {
                        "internalType": "bool[]",
                        "name": "feedInvertFlags",
                        "type": "bool[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "loanToValue",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "interestAPR",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "postponement",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "duration",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minCreditAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "availableCreditLimit",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "utilizedCreditId",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "nonceSpace",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "nonce",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "expiration",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "proposerSpecHash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bool",
                        "name": "isProposerLender",
                        "type": "bool"
                    },
                    {
                        "internalType": "address",
                        "name": "loanContract",
                        "type": "address"
                    }
                ],
                "internalType": "struct PWNInstallmentsProduct.Proposal",
                "name": "",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "creditAmount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct PWNInstallmentsProduct.AcceptorValues",
                "name": "",
                "type": "tuple"
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
                        "internalType": "address",
                        "name": "collateralAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "creditAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "address[]",
                        "name": "feedIntermediaryDenominations",
                        "type": "address[]"
                    },
                    {
                        "internalType": "bool[]",
                        "name": "feedInvertFlags",
                        "type": "bool[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "loanToValue",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "interestAPR",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "postponement",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "duration",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minCreditAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "availableCreditLimit",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "utilizedCreditId",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "nonceSpace",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "nonce",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "expiration",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "proposerSpecHash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bool",
                        "name": "isProposerLender",
                        "type": "bool"
                    },
                    {
                        "internalType": "address",
                        "name": "loanContract",
                        "type": "address"
                    }
                ],
                "internalType": "struct PWNInstallmentsProduct.Proposal",
                "name": "proposal",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "creditAmount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct PWNInstallmentsProduct.AcceptorValues",
                "name": "acceptorValues",
                "type": "tuple"
            }
        ],
        "name": "encodeProposalData",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "creditAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "creditAmount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "collateralAddress",
                "type": "address"
            },
            {
                "internalType": "address[]",
                "name": "feedIntermediaryDenominations",
                "type": "address[]"
            },
            {
                "internalType": "bool[]",
                "name": "feedInvertFlags",
                "type": "bool[]"
            },
            {
                "internalType": "uint256",
                "name": "loanToValue",
                "type": "uint256"
            }
        ],
        "name": "getCollateralAmount",
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
                "internalType": "address",
                "name": "loanContract",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "getDefaultDebtLimit",
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
                "internalType": "bytes",
                "name": "proposalData",
                "type": "bytes"
            }
        ],
        "name": "hashProposalTypedData",
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

        ],
        "name": "hub",
        "outputs": [
            {
                "internalType": "contract PWNHub",
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
                "internalType": "address",
                "name": "loanContract",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            }
        ],
        "name": "interest",
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
                "internalType": "address",
                "name": "loanContract",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            }
        ],
        "name": "isDefaulted",
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
                "internalType": "uint256",
                "name": "loanId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "liquidator",
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
                "internalType": "address",
                "name": "",
                "type": "address"
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
                "internalType": "bytes",
                "name": "liquidationData",
                "type": "bytes"
            }
        ],
        "name": "liquidate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "liquidationAmount",
                "type": "uint256"
            }
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
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "loanData",
        "outputs": [
            {
                "internalType": "uint40",
                "name": "apr",
                "type": "uint40"
            },
            {
                "internalType": "uint40",
                "name": "defaultTimestamp",
                "type": "uint40"
            },
            {
                "internalType": "uint176",
                "name": "debtLimitTangent",
                "type": "uint176"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "nameAndVersion",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "version",
                "type": "string"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "revokedNonce",
        "outputs": [
            {
                "internalType": "contract PWNRevokedNonce",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [

        ],
        "name": "utilizedCredit",
        "outputs": [
            {
                "internalType": "contract PWNUtilizedCredit",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

export default PWN_INSTALLMENTS_PRODUCT_ABI;