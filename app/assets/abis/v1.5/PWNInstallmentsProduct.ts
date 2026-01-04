export const PWN_INSTALLMENTS_PRODUCT_ABI = [
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "_hub",
          "type": "address",
          "internalType": "contract PWNHub"
        },
        {
          "name": "_revokedNonce",
          "type": "address",
          "internalType": "contract PWNRevokedNonce"
        },
        {
          "name": "_utilizedCredit",
          "type": "address",
          "internalType": "contract PWNUtilizedCredit"
        },
        {
          "name": "_chainlinkFeedRegistry",
          "type": "address",
          "internalType": "contract IChainlinkFeedRegistryLike"
        },
        {
          "name": "_chainlinkL2SequencerUptimeFeed",
          "type": "address",
          "internalType": "contract IChainlinkAggregatorLike"
        },
        {
          "name": "_weth",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "APR_DECIMALS",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "DEBT_LIMIT_TANGENT_DECIMALS",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "DOMAIN_SEPARATOR",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "LOAN_TO_VALUE_DECIMALS",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "MAX_INTERMEDIARY_DENOMINATIONS",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "MIN_DURATION",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "NAME",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "string",
          "internalType": "string"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "PROPOSAL_TYPEHASH",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "VERSION",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "string",
          "internalType": "string"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "acceptProposal",
      "inputs": [
        {
          "name": "loanId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "acceptor",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "proposer",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "proposalData",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "outputs": [
        {
          "name": "loanTerms",
          "type": "tuple",
          "internalType": "struct LoanTerms",
          "components": [
            {
              "name": "isProposerLender",
              "type": "bool",
              "internalType": "bool"
            },
            {
              "name": "proposerSpecHash",
              "type": "bytes32",
              "internalType": "bytes32"
            },
            {
              "name": "collateral",
              "type": "tuple",
              "internalType": "struct MultiToken.Asset",
              "components": [
                {
                  "name": "category",
                  "type": "uint8",
                  "internalType": "enum MultiToken.Category"
                },
                {
                  "name": "assetAddress",
                  "type": "address",
                  "internalType": "address"
                },
                {
                  "name": "id",
                  "type": "uint256",
                  "internalType": "uint256"
                },
                {
                  "name": "amount",
                  "type": "uint256",
                  "internalType": "uint256"
                }
              ]
            },
            {
              "name": "creditAddress",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "principal",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "decodeProposalData",
      "inputs": [
        {
          "name": "proposalData",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple",
          "internalType": "struct PWNInstallmentsProduct.Proposal",
          "components": [
            {
              "name": "collateralAddress",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "creditAddress",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "feedIntermediaryDenominations",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "feedInvertFlags",
              "type": "bool[]",
              "internalType": "bool[]"
            },
            {
              "name": "loanToValue",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "interestAPR",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "postponement",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "duration",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "minCreditAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "availableCreditLimit",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "utilizedCreditId",
              "type": "bytes32",
              "internalType": "bytes32"
            },
            {
              "name": "nonceSpace",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "nonce",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "expiration",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "proposerSpecHash",
              "type": "bytes32",
              "internalType": "bytes32"
            },
            {
              "name": "isProposerLender",
              "type": "bool",
              "internalType": "bool"
            },
            {
              "name": "allowedAcceptor",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "loanContract",
              "type": "address",
              "internalType": "address"
            }
          ]
        },
        {
          "name": "",
          "type": "tuple",
          "internalType": "struct PWNInstallmentsProduct.AcceptorValues",
          "components": [
            {
              "name": "creditAmount",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        }
      ],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "encodeProposalData",
      "inputs": [
        {
          "name": "proposal",
          "type": "tuple",
          "internalType": "struct PWNInstallmentsProduct.Proposal",
          "components": [
            {
              "name": "collateralAddress",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "creditAddress",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "feedIntermediaryDenominations",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "feedInvertFlags",
              "type": "bool[]",
              "internalType": "bool[]"
            },
            {
              "name": "loanToValue",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "interestAPR",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "postponement",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "duration",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "minCreditAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "availableCreditLimit",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "utilizedCreditId",
              "type": "bytes32",
              "internalType": "bytes32"
            },
            {
              "name": "nonceSpace",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "nonce",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "expiration",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "proposerSpecHash",
              "type": "bytes32",
              "internalType": "bytes32"
            },
            {
              "name": "isProposerLender",
              "type": "bool",
              "internalType": "bool"
            },
            {
              "name": "allowedAcceptor",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "loanContract",
              "type": "address",
              "internalType": "address"
            }
          ]
        },
        {
          "name": "acceptorValues",
          "type": "tuple",
          "internalType": "struct PWNInstallmentsProduct.AcceptorValues",
          "components": [
            {
              "name": "creditAmount",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "getCollateralAmount",
      "inputs": [
        {
          "name": "creditAddress",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "creditAmount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "collateralAddress",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "feedIntermediaryDenominations",
          "type": "address[]",
          "internalType": "address[]"
        },
        {
          "name": "feedInvertFlags",
          "type": "bool[]",
          "internalType": "bool[]"
        },
        {
          "name": "loanToValue",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getDefaultDebtLimit",
      "inputs": [
        {
          "name": "loanContract",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "loanId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "timestamp",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "hashProposalTypedData",
      "inputs": [
        {
          "name": "proposalData",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "hub",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract PWNHub"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "interest",
      "inputs": [
        {
          "name": "loanContract",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "loanId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "isDefaulted",
      "inputs": [
        {
          "name": "loanContract",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "loanId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "liquidate",
      "inputs": [
        {
          "name": "loanId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "liquidator",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "collateral",
          "type": "tuple",
          "internalType": "struct MultiToken.Asset",
          "components": [
            {
              "name": "category",
              "type": "uint8",
              "internalType": "enum MultiToken.Category"
            },
            {
              "name": "assetAddress",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "id",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "amount",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        },
        {
          "name": "liquidationData",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "outputs": [
        {
          "name": "liquidationAmount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "loanData",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "apr",
          "type": "uint40",
          "internalType": "uint40"
        },
        {
          "name": "defaultTimestamp",
          "type": "uint40",
          "internalType": "uint40"
        },
        {
          "name": "debtLimitTangent",
          "type": "uint176",
          "internalType": "uint176"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "nameAndVersion",
      "inputs": [],
      "outputs": [
        {
          "name": "name",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "version",
          "type": "string",
          "internalType": "string"
        }
      ],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "revokedNonce",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract PWNRevokedNonce"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "utilizedCredit",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract PWNUtilizedCredit"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "error",
      "name": "AddressMissingHubTag",
      "inputs": [
        {
          "name": "addr",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "tag",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ]
    },
    {
      "type": "error",
      "name": "CallerNotAllowedAcceptor",
      "inputs": [
        {
          "name": "current",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "allowed",
          "type": "address",
          "internalType": "address"
        }
      ]
    },
    {
      "type": "error",
      "name": "CallerNotLoanContract",
      "inputs": [
        {
          "name": "caller",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "loanContract",
          "type": "address",
          "internalType": "address"
        }
      ]
    },
    {
      "type": "error",
      "name": "ChainlinkFeedPriceTooOld",
      "inputs": [
        {
          "name": "feed",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "updatedAt",
          "type": "uint256",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "error",
      "name": "ChainlinkFeedReturnedNegativePrice",
      "inputs": [
        {
          "name": "feed",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "price",
          "type": "int256",
          "internalType": "int256"
        },
        {
          "name": "updatedAt",
          "type": "uint256",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "error",
      "name": "ChainlinkInvalidInputLenghts",
      "inputs": []
    },
    {
      "type": "error",
      "name": "DurationTooShort",
      "inputs": []
    },
    {
      "type": "error",
      "name": "Expired",
      "inputs": [
        {
          "name": "current",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "expiration",
          "type": "uint256",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "error",
      "name": "GracePeriodNotOver",
      "inputs": [
        {
          "name": "timeSinceUp",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "gracePeriod",
          "type": "uint256",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "error",
      "name": "InsufficientCreditAmount",
      "inputs": [
        {
          "name": "current",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "limit",
          "type": "uint256",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "error",
      "name": "IntermediaryDenominationsOutOfBounds",
      "inputs": [
        {
          "name": "current",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "limit",
          "type": "uint256",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "error",
      "name": "InvalidLoanToValue",
      "inputs": []
    },
    {
      "type": "error",
      "name": "L2SequencerDown",
      "inputs": []
    },
    {
      "type": "error",
      "name": "LiquidationDataNotEmpty",
      "inputs": []
    },
    {
      "type": "error",
      "name": "LiquidatorNotLoanOwner",
      "inputs": [
        {
          "name": "owner",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "liquidator",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "loanContract",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "loanId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "error",
      "name": "LoanNotInitialized",
      "inputs": []
    },
    {
      "type": "error",
      "name": "LoanToValueZero",
      "inputs": []
    },
    {
      "type": "error",
      "name": "MinCreditAmountNotSet",
      "inputs": []
    },
    {
      "type": "error",
      "name": "NonceNotUsable",
      "inputs": [
        {
          "name": "addr",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "nonceSpace",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "nonce",
          "type": "uint256",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "error",
      "name": "PostponementBiggerThanDuration",
      "inputs": []
    }
] as const;

export default PWN_INSTALLMENTS_PRODUCT_ABI;