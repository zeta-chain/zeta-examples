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
    MPI_ADDRESS: "0x4a2d53e16ebe3feC54B407c9e29590951Ce2b6ad",
    chainId: 97,
    crossChainId: 5,
    crossChainName: "goerli",
  },
  goerli: {
    MPI_ADDRESS: "0x4740f4051eA6D896C694303228D86Ba3141065ca",
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
