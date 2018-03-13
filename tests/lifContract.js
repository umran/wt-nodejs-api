const abi = [
  {
    'constant': true,
    'inputs': [],
    'name': 'mintingFinished',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_spender',
        'type': 'address',
      },
      {
        'name': '_value',
        'type': 'uint256',
      },
    ],
    'name': 'approve',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_spender',
        'type': 'address',
      },
      {
        'name': '_addedValue',
        'type': 'uint256',
      },
      {
        'name': '_data',
        'type': 'bytes',
      },
    ],
    'name': 'increaseApproval',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'totalSupply',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_from',
        'type': 'address',
      },
      {
        'name': '_to',
        'type': 'address',
      },
      {
        'name': '_value',
        'type': 'uint256',
      },
    ],
    'name': 'transferFrom',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'DECIMALS',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [],
    'name': 'unpause',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_to',
        'type': 'address',
      },
      {
        'name': '_amount',
        'type': 'uint256',
      },
    ],
    'name': 'mint',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_spender',
        'type': 'address',
      },
      {
        'name': '_value',
        'type': 'uint256',
      },
      {
        'name': '_data',
        'type': 'bytes',
      },
    ],
    'name': 'approve',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'paused',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_spender',
        'type': 'address',
      },
      {
        'name': '_subtractedValue',
        'type': 'uint256',
      },
    ],
    'name': 'decreaseApproval',
    'outputs': [
      {
        'name': 'success',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '_owner',
        'type': 'address',
      },
    ],
    'name': 'balanceOf',
    'outputs': [
      {
        'name': 'balance',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_spender',
        'type': 'address',
      },
      {
        'name': '_subtractedValue',
        'type': 'uint256',
      },
      {
        'name': '_data',
        'type': 'bytes',
      },
    ],
    'name': 'decreaseApproval',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [],
    'name': 'finishMinting',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [],
    'name': 'pause',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'owner',
    'outputs': [
      {
        'name': '',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'NAME',
    'outputs': [
      {
        'name': '',
        'type': 'string',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_to',
        'type': 'address',
      },
      {
        'name': '_value',
        'type': 'uint256',
      },
    ],
    'name': 'transfer',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'MAX_LIF_FAUCET',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_from',
        'type': 'address',
      },
      {
        'name': '_to',
        'type': 'address',
      },
      {
        'name': '_value',
        'type': 'uint256',
      },
      {
        'name': '_data',
        'type': 'bytes',
      },
    ],
    'name': 'transferFrom',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_to',
        'type': 'address',
      },
      {
        'name': '_value',
        'type': 'uint256',
      },
      {
        'name': '_data',
        'type': 'bytes',
      },
    ],
    'name': 'transfer',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_spender',
        'type': 'address',
      },
      {
        'name': '_addedValue',
        'type': 'uint256',
      },
    ],
    'name': 'increaseApproval',
    'outputs': [
      {
        'name': 'success',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '_owner',
        'type': 'address',
      },
      {
        'name': '_spender',
        'type': 'address',
      },
    ],
    'name': 'allowance',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'transferOwnership',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'SYMBOL',
    'outputs': [
      {
        'name': '',
        'type': 'string',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'anonymous': false,
    'inputs': [],
    'name': 'Pause',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [],
    'name': 'Unpause',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'to',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'amount',
        'type': 'uint256',
      },
    ],
    'name': 'Mint',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [],
    'name': 'MintFinished',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'previousOwner',
        'type': 'address',
      },
      {
        'indexed': true,
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'OwnershipTransferred',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'burner',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'value',
        'type': 'uint256',
      },
    ],
    'name': 'Burn',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'owner',
        'type': 'address',
      },
      {
        'indexed': true,
        'name': 'spender',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'value',
        'type': 'uint256',
      },
    ],
    'name': 'Approval',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'from',
        'type': 'address',
      },
      {
        'indexed': true,
        'name': 'to',
        'type': 'address',
      },
      {
        'indexed': false,
        'name': 'value',
        'type': 'uint256',
      },
    ],
    'name': 'Transfer',
    'type': 'event',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'spender',
        'type': 'address',
      },
      {
        'name': 'value',
        'type': 'uint256',
      },
      {
        'name': 'data',
        'type': 'bytes',
      },
    ],
    'name': 'approveData',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'to',
        'type': 'address',
      },
      {
        'name': 'value',
        'type': 'uint256',
      },
      {
        'name': 'data',
        'type': 'bytes',
      },
    ],
    'name': 'transferData',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'from',
        'type': 'address',
      },
      {
        'name': 'to',
        'type': 'address',
      },
      {
        'name': 'value',
        'type': 'uint256',
      },
      {
        'name': 'data',
        'type': 'bytes',
      },
    ],
    'name': 'transferDataFrom',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [],
    'name': 'faucetLif',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_value',
        'type': 'uint256',
      },
    ],
    'name': 'burn',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
];

const byteCode = '0x606060405260038054600160b060020a03191633600160a060020a03161790556115af8061002e6000396000f30060606040526004361061017f5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166305d2035b8114610184578063095ea7b3146101ab57806316ca3b63146101cd57806318160ddd1461023257806323b872dd146102575780632e0f26251461027f5780633f4ba83a1461029257806340c10f19146102a757806342966c68146102c95780635c17f9f4146102df5780635c975abb1461034457806366188463146103575780636ef3ef7e1461037957806370a08231146103de5780637272ad49146103fd5780637d64bcb4146104625780638456cb59146104755780638da5cb5b14610488578063a3f4df7e146104b7578063a9059cbb14610541578063a981f56b14610563578063ab67aa5814610576578063be45fd62146105e2578063c0e37b1514610647578063d73dd623146106ac578063dd62ed3e146106ce578063e1181c73146106f3578063efef445b14610706578063f2fde38b14610772578063f76f8d7814610791575b600080fd5b341561018f57600080fd5b6101976107a4565b604051901515815260200160405180910390f35b34156101b657600080fd5b610197600160a060020a03600435166024356107b4565b34156101d857600080fd5b61019760048035600160a060020a03169060248035919060649060443590810190830135806020601f820181900481020160405190810160405281815292919060208401838380828437509496506107df95505050505050565b341561023d57600080fd5b61024561089d565b60405190815260200160405180910390f35b341561026257600080fd5b610197600160a060020a03600435811690602435166044356108a3565b341561028a57600080fd5b6102456108d0565b341561029d57600080fd5b6102a56108d5565b005b34156102b257600080fd5b610197600160a060020a0360043516602435610955565b34156102d457600080fd5b6102a5600435610a51565b34156102ea57600080fd5b61019760048035600160a060020a03169060248035919060649060443590810190830135806020601f82018190048102016040519081016040528181529291906020840183838082843750949650610aa195505050505050565b341561034f57600080fd5b610197610ace565b341561036257600080fd5b610197600160a060020a0360043516602435610ade565b341561038457600080fd5b61019760048035600160a060020a03169060248035919060649060443590810190830135806020601f82018190048102016040519081016040528181529291906020840183838082843750949650610b0295505050505050565b34156103e957600080fd5b610245600160a060020a0360043516610b27565b341561040857600080fd5b61019760048035600160a060020a03169060248035919060649060443590810190830135806020601f82018190048102016040519081016040528181529291906020840183838082843750949650610b4295505050505050565b341561046d57600080fd5b610197610b6f565b341561048057600080fd5b6102a5610bfa565b341561049357600080fd5b61049b610c7f565b604051600160a060020a03909116815260200160405180910390f35b34156104c257600080fd5b6104ca610c8e565b60405160208082528190810183818151815260200191508051906020019080838360005b838110156105065780820151838201526020016104ee565b50505050905090810190601f1680156105335780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561054c57600080fd5b610197600160a060020a0360043516602435610cc5565b341561056e57600080fd5b610245610ce9565b341561058157600080fd5b610197600160a060020a036004803582169160248035909116916044359160849060643590810190830135806020601f82018190048102016040519081016040528181529291906020840183838082843750949650610cf695505050505050565b34156105ed57600080fd5b61019760048035600160a060020a03169060248035919060649060443590810190830135806020601f82018190048102016040519081016040528181529291906020840183838082843750949650610db695505050505050565b341561065257600080fd5b61019760048035600160a060020a03169060248035919060649060443590810190830135806020601f82018190048102016040519081016040528181529291906020840183838082843750949650610de395505050505050565b34156106b757600080fd5b610197600160a060020a0360043516602435610e08565b34156106d957600080fd5b610245600160a060020a0360043581169060243516610e2c565b34156106fe57600080fd5b6102a5610e57565b341561071157600080fd5b610197600160a060020a036004803582169160248035909116916044359160849060643590810190830135806020601f82018190048102016040519081016040528181529291906020840183838082843750949650610f0f95505050505050565b341561077d57600080fd5b6102a5600160a060020a0360043516610f3e565b341561079c57600080fd5b6104ca610fd9565b60035460a060020a900460ff1681565b60035460009060a860020a900460ff16156107ce57600080fd5b6107d88383611010565b9392505050565b600030600160a060020a031684600160a060020a03161415151561080257600080fd5b61080c848461107c565b5083600160a060020a03168260405180828051906020019080838360005b8381101561084257808201518382015260200161082a565b50505050905090810190601f16801561086f5780820380516001836020036101000a031916815260200191505b5091505060006040518083038160008661646e5a03f1915050151561089357600080fd5b5060019392505050565b60015490565b60035460009060a860020a900460ff16156108bd57600080fd5b6108c8848484611120565b949350505050565b601281565b60035433600160a060020a039081169116146108f057600080fd5b60035460a860020a900460ff16151561090857600080fd5b6003805475ff000000000000000000000000000000000000000000191690557f7805862f689e2f13df9f062ff482ad3ad112aca9e0847911ed832e158c525b3360405160405180910390a1565b60035460009033600160a060020a0390811691161461097357600080fd5b60035460a060020a900460ff161561098a57600080fd5b60015461099d908363ffffffff61128e16565b600155600160a060020a0383166000908152602081905260409020546109c9908363ffffffff61128e16565b600160a060020a0384166000818152602081905260409081902092909255907f0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d41213968859084905190815260200160405180910390a2600160a060020a03831660006000805160206115648339815191528460405190815260200160405180910390a350600192915050565b60035460a860020a900460ff1615610a6857600080fd5b610a718161129d565b600033600160a060020a03166000805160206115648339815191528360405190815260200160405180910390a350565b600030600160a060020a031684600160a060020a031614151515610ac457600080fd5b61080c8484611010565b60035460a860020a900460ff1681565b60035460009060a860020a900460ff1615610af857600080fd5b6107d88383611357565b60035460009060a860020a900460ff1615610b1c57600080fd5b6108c8848484610aa1565b600160a060020a031660009081526020819052604090205490565b600030600160a060020a031684600160a060020a031614151515610b6557600080fd5b61080c8484611357565b60035460009033600160a060020a03908116911614610b8d57600080fd5b60035460a060020a900460ff1615610ba457600080fd5b6003805474ff0000000000000000000000000000000000000000191660a060020a1790557fae5184fba832cb2b1f702aca6117b8d265eaf03ad33eb133f19dde0f5920fa0860405160405180910390a150600190565b60035433600160a060020a03908116911614610c1557600080fd5b60035460a860020a900460ff1615610c2c57600080fd5b6003805475ff000000000000000000000000000000000000000000191660a860020a1790557f6985a02210a168e66602d3235cb6db0e70f92b3ba4d376a33c0f3d9434bff62560405160405180910390a1565b600354600160a060020a031681565b60408051908101604052600481527f4cc3ad6600000000000000000000000000000000000000000000000000000000602082015281565b60035460009060a860020a900460ff1615610cdf57600080fd5b6107d88383611451565b6802b5e3af16b188000081565b600030600160a060020a031684600160a060020a031614151515610d1957600080fd5b610d24858585611120565b5083600160a060020a03168260405180828051906020019080838360005b83811015610d5a578082015183820152602001610d42565b50505050905090810190601f168015610d875780820380516001836020036101000a031916815260200191505b5091505060006040518083038160008661646e5a03f19150501515610dab57600080fd5b506001949350505050565b600030600160a060020a031684600160a060020a031614151515610dd957600080fd5b61080c8484611451565b60035460009060a860020a900460ff1615610dfd57600080fd5b6108c8848484610db6565b60035460009060a860020a900460ff1615610e2257600080fd5b6107d8838361107c565b600160a060020a03918216600090815260026020908152604080832093909416825291909152205490565b600160a060020a033316600090815260208190526040812054610e8a906802b5e3af16b18800009063ffffffff61155116565b600154909150610ea0908263ffffffff61128e16565b600155600160a060020a033316600090815260208190526040902054610ecc908263ffffffff61128e16565b600160a060020a0333166000818152602081905260408082209390935590916000805160206115648339815191529084905190815260200160405180910390a350565b60035460009060a860020a900460ff1615610f2957600080fd5b610f3585858585610cf6565b95945050505050565b60035433600160a060020a03908116911614610f5957600080fd5b600160a060020a0381161515610f6e57600080fd5b600354600160a060020a0380831691167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a36003805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0392909216919091179055565b60408051908101604052600381527f4c49460000000000000000000000000000000000000000000000000000000000602082015281565b600160a060020a03338116600081815260026020908152604080832094871680845294909152808220859055909291907f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259085905190815260200160405180910390a350600192915050565b600160a060020a0333811660009081526002602090815260408083209386168352929052908120546110b4908363ffffffff61128e16565b600160a060020a0333811660008181526002602090815260408083209489168084529490915290819020849055919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591905190815260200160405180910390a350600192915050565b6000600160a060020a038316151561113757600080fd5b600160a060020a03841660009081526020819052604090205482111561115c57600080fd5b600160a060020a038085166000908152600260209081526040808320339094168352929052205482111561118f57600080fd5b600160a060020a0384166000908152602081905260409020546111b8908363ffffffff61155116565b600160a060020a0380861660009081526020819052604080822093909355908516815220546111ed908363ffffffff61128e16565b600160a060020a0380851660009081526020818152604080832094909455878316825260028152838220339093168252919091522054611233908363ffffffff61155116565b600160a060020a03808616600081815260026020908152604080832033861684529091529081902093909355908516916000805160206115648339815191529085905190815260200160405180910390a35060019392505050565b6000828201838110156107d857fe5b600160a060020a0333166000908152602081905260408120548211156112c257600080fd5b5033600160a060020a0381166000908152602081905260409020546112e79083611551565b600160a060020a038216600090815260208190526040902055600154611313908363ffffffff61155116565b600155600160a060020a0381167fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca58360405190815260200160405180910390a25050565b600160a060020a033381166000908152600260209081526040808320938616835292905290812054808311156113b457600160a060020a0333811660009081526002602090815260408083209388168352929052908120556113eb565b6113c4818463ffffffff61155116565b600160a060020a033381166000908152600260209081526040808320938916835292905220555b600160a060020a0333811660008181526002602090815260408083209489168084529490915290819020547f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925915190815260200160405180910390a35060019392505050565b6000600160a060020a038316151561146857600080fd5b600160a060020a03331660009081526020819052604090205482111561148d57600080fd5b600160a060020a0333166000908152602081905260409020546114b6908363ffffffff61155116565b600160a060020a0333811660009081526020819052604080822093909355908516815220546114eb908363ffffffff61128e16565b60008085600160a060020a0316600160a060020a031681526020019081526020016000208190555082600160a060020a031633600160a060020a03166000805160206115648339815191528460405190815260200160405180910390a350600192915050565b60008282111561155d57fe5b509003905600ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa165627a7a7230582048612ee71aca596380f7222df231a7bd6e044935a88d5ec9de86857eb825b1a90029';

module.exports = {
  abi,
  byteCode,
};
