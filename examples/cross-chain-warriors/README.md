# Cross Chain Warriors

[![Docs](https://img.shields.io/badge/Zeta%20docs-🔗-43ad51)](https://docs.zetachain.com/develop/examples/cross-chain-nft)

A cross-chain NFT collection using [Zeta MPI](https://docs.zetachain.com/reference/message-passing-api).

## Try it in testnet

The collection is currently deployed to [BSC Testnet](https://testnet.bscscan.com/address/0xF3161666AaEd3716b12205Dc10A425a4BdBC9ce0) and [Goerli](https://goerli.etherscan.io/address/0x241F17B6f190e485bA4B24768137Fa7166F0E925), the contracts are verified so you can use BscScan and Etherscan to play with them.

### Doing a cross-chain NFT transfer

1. Go to the [BSC Testnet contract's write methods](https://testnet.bscscan.com/address/0xF3161666AaEd3716b12205Dc10A425a4BdBC9ce0#writeContract).
1. Connect with your wallet.
1. Mint an NFT to your address.
1. View the transaction and copy the TokenId.
1. Call the crossChainTransfer method with the receiver address on the other chain and the TokenId you just minted.
1. After the transaction was mined, go to the contract's read methods and call ownerOf TokenId, you should get an `execution reverted` message since the NFT was burnt by the crossChainTransfer.
1. Go to the [Goerli contract's read methods](https://goerli.etherscan.io/address/0x241F17B6f190e485bA4B24768137Fa7166F0E925#readContract).
1. Call the ownerOf method with your TokenId, the owner should be the receiver address you used before. *If it's not, note that the cross-chain transfer may take around 1 minute.*

## Environment variables

Follow the template in `.env.example`.

* The private key should **not** include `0x`.
* To verify your contracts, you'll need api keys both in BscScan and Etherscan.

## Deployment

After setting your environment variables, navigate to this folder and run the following commands to deploy (order matters):

```bash
  yarn hardhat run scripts/deploy.ts --network bsctestnet
```

```bash
  yarn hardhat run scripts/deploy.ts --network goerli
```

```bash
  yarn hardhat run scripts/set-cross-chain-data.ts --network bsctestnet
```

```bash
  yarn hardhat run scripts/set-cross-chain-data.ts --network goerli
```

## Running Tests

```bash
  yarn test
```
