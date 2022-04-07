# Multi Chain Value

[![Docs](https://img.shields.io/badge/Zeta%20docs-🔗-43ad51)](https://docs.zetachain.com/develop/examples/multi-chain-value-transfer)

Transfer value across chains using [Zeta MPI](https://docs.zetachain.com/reference/message-passing-api).

## Try it in testnet

This example is currently deployed to [BSC Testnet](https://testnet.bscscan.com/address/0x0E396e23cAD688c0e5252B20dFeAcC248b0d8B01) and [Goerli](https://goerli.etherscan.io/address/0x8bA6c6047AA5a55C2Ce10615b1D358Cb4B9D27f6), the contracts are verified so you can use BscScan and Etherscan to play with them.

### Doing a cross-chain value transfer

1. Get some [testnet Zeta](https://docs.zetachain.com/develop/get-testnet-zeta).
1. Go to the [BSC Testnet Zeta token contract write methods](https://testnet.bscscan.com/address/0x6Cc37160976Bbd1AecB5Cce4C440B28e883c7898#writeContract).
1. Connect with your wallet.
1. Give allowance to the multi-chain value contract: `0x0E396e23cAD688c0e5252B20dFeAcC248b0d8B01`.
1. Go to the [BSC Testnet contract's write methods](https://testnet.bscscan.com/address/0x0E396e23cAD688c0e5252B20dFeAcC248b0d8B01#writeContract).
1. Connect with your wallet.
1. Transfer an allowed amount of Zeta to Goerli (chain id 5). *Make sure to convert the destinationAddress to bytes, you can use [this code snippet](https://stackblitz.com/edit/typescript-bwhh4c?file=index.ts).*
1. Check the receiver address balance in Goerli. *Note that the cross-chain transfer may take around 1 minute.*

## Environment variables

Follow the template in `.env.example`.

* The private key should **not** include `0x`.
* To verify your contracts, you'll need api keys both in BscScan and Etherscan.

## Deployment

After setting your environment variables navigate to this folder and run the following commands to deploy (order matters):

```bash
  yarn hardhat run scripts/deploy.ts --network bsctestnet
```

```bash
  yarn hardhat run scripts/deploy.ts --network goerli
```

## Running Tests

```bash
  yarn test
```
