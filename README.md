# Cross Chain Warriors

A cross-chain NFT collection powered by [ZetaChain](https://www.zetachain.com/).

## Try it in testnet

The collection is currently deployed to BSC Testnet and Goerli, the contracts are verified so you can use BscScan and Etherscan to play with them.

### Doing a cross-chain NFT transfer

1. Go to the [BSC Testnet contract's write methods](https://testnet.bscscan.com/address/@todo#writeContract).
1. Connect with your wallet.
1. Mint an NFT to your address.
1. View the transaction and copy the TokenID.
1. Call the crossChainTransfer method with the receiver address in the other chain and the TokenID you just minted.
1. After the transaction was mined, go to the contract's read methods and call ownerOf TokenID, you should get an `execution reverted` message since the NFT was burnt on the crossChainTransfer.
1. Go to the [Goerli contract's read methods](https://goerli.etherscan.io/address/@todo#code).
1. Call the ownerOf method with your TokenID, the owner should be the receiver address you used before. *If it's not, note that the cross-chain transfer may take around 1 minute.*

## Environment variables

Follow the template in `.env.example`.

* The private key should **not** include `0x`.
* To verify your contracts, you'll need api keys both in BscScan and Etherscan.

## Deployment

After setting your environment variables, run the following commands to deploy (order matters):

```bash
  npx hardhat run scripts/deploy.ts --network bsctestnet
```

```bash
  npx hardhat run scripts/deploy.ts --network goerli
```

```bash
  npx hardhat run scripts/scripts/set-cross-chain-data.ts --network bsctestnet
```

```bash
  npx hardhat run scripts/scripts/set-cross-chain-data.ts --network goerli
```

## Running Tests

```bash
  npm run test
```
