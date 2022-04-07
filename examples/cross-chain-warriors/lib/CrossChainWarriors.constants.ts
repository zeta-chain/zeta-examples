import { network } from "hardhat";

import localAddressConstants from "../addressConstants.local.json";
import testnetAddressConstants from "../addressConstants.testnet.json";

export type NetworkName = "bsctestnet" | "goerli" | "hardhat";

type ChainId = 5 | 97 | 1337;

export type NetworkVariables = {
  MPI_ADDRESS: string;
  chainId: ChainId;
  crossChainId: ChainId;
  crossChainName: NetworkName;
};

export const networkVariables: Record<NetworkName, NetworkVariables> = {
  bsctestnet: {
    MPI_ADDRESS: "0xE626402550fB921E4a47c11568F89dF3496fbEF0",
    chainId: 97,
    crossChainId: 5,
    crossChainName: "goerli",
  },
  goerli: {
    MPI_ADDRESS: "0x68Bc806414e743D88436AEB771Be387A55B4df70",
    chainId: 5,
    crossChainId: 97,
    crossChainName: "bsctestnet",
  },
  hardhat: {
    MPI_ADDRESS: "0x0000000000000000000000000000000000000000",
    chainId: 1337,
    crossChainId: 1337,
    crossChainName: "hardhat",
  },
};

export const isNetworkName = (str: string): str is NetworkName => str in networkVariables;

export type AddressConstants = Partial<
  Record<
    NetworkName,
    {
      crossChainWarriorsAddress: string;
    }
  >
>;

export const getAddressConstants = () => {
  if (!isNetworkName(network.name)) throw new Error("Invalid network name");

  return network.name === "hardhat" ? localAddressConstants : testnetAddressConstants;
};
