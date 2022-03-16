# Cross Chain Warriors

[![Docs](https://img.shields.io/badge/Zeta%20docs-🔗-43ad51)](https://docs.staging.zetachain.com/develop/examples/cross-chain-nft)

A cross-chain NFT collection using [Zeta MPI](https://docs.staging.zetachain.com/reference/message-passing-api).

## Try it in testnet

The collection is currently deployed to [BSC Testnet](https://testnet.bscscan.com/address/0x3034b2C956451d074377FF322F2671fA16572e44) and [Goerli](https://goerli.etherscan.io/address/0x8f58B921D6be6e5C624AAa7a525c394f25f42767), the contracts are verified so you can use BscScan and Etherscan to play with them.

### Doing a cross-chain NFT transfer

1. Go to the [BSC Testnet contract's write methods](https://testnet.bscscan.com/address/0x3034b2C956451d074377FF322F2671fA16572e44#writeContract).
1. Connect with your wallet.
1. Mint an NFT to your address.
1. View the transaction and copy the TokenID.
1. Call the crossChainTransfer method with the receiver address on the other chain and the TokenID you just minted.
1. After the transaction was mined, go to the contract's read methods and call ownerOf TokenID, you should get an `execution reverted` message since the NFT was burnt by the crossChainTransfer.
1. Go to the [Goerli contract's read methods](https://goerli.etherscan.io/address/0x8f58B921D6be6e5C624AAa7a525c394f25f42767#readContract).
1. Call the ownerOf method with your TokenID, the owner should be the receiver address you used before. *If it's not, note that the cross-chain transfer may take around 1 minute.*

## Environment variables

Follow the template in `.env.example`.

* The private key should **not** include `0x`.
* To verify your contracts, you'll need api keys both in BscScan and Etherscan.

## Deployment

After setting your environment variables, run the following commands to deploy (order matters):

```bash
  yarn hardhat run scripts/cross-chain-warriors/deploy.ts --network bsctestnet
```

```bash
  yarn hardhat run scripts/cross-chain-warriors/deploy.ts --network goerli
```

```bash
  yarn hardhat run scripts/cross-chain-warriors/set-cross-chain-data.ts --network bsctestnet
```

```bash
  yarn hardhat run scripts/cross-chain-warriors/set-cross-chain-data.ts --network goerli
```

## Running Tests

```bash
  yarn test
```
