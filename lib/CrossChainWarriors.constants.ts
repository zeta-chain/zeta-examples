import { network } from "hardhat";

import localAddressConstants from "../addressConstants.local.json";
import testnetAddressConstants from "../addressConstants.testnet.json";

export type NetworkName = "bsctestnet" | "goerli" | "hardhat";

type ChainId = 97 | 420 | 1337;

export type NetworkVariables = {
  MPI_ADDRESS: string;
  ZETA_TOKEN_ADDRESS: string;
  chainId: ChainId;
  crossChainId: ChainId;
  crossChainName: NetworkName;
};

export const networkVariables: Record<NetworkName, NetworkVariables> = {
  bsctestnet: {
    MPI_ADDRESS: "0x96cE47e42A73649CFe33d93D93ACFbEc6FD5ee14",
    ZETA_TOKEN_ADDRESS: "0x4Ce8B40F7b64Ce5A5EbAc2349BAb6Ea0EBCC2240",
    chainId: 97,
    crossChainId: 420,
    crossChainName: "goerli",
  },
  goerli: {
    MPI_ADDRESS: "0x132b042bD5198a48E4D273f46b979E5f13Bd9239",
    ZETA_TOKEN_ADDRESS: "0x88Be1F872F0A9B04961eBf3f8Bb998417EE8D54E",
    chainId: 420,
    crossChainId: 97,
    crossChainName: "bsctestnet",
  },
  hardhat: {
    MPI_ADDRESS: "0x96cE47e42A73649CFe33d93D93ACFbEc6FD5ee14", // @todo (lucas): change this
    ZETA_TOKEN_ADDRESS: "0x88Be1F872F0A9B04961eBf3f8Bb998417EE8D54E", // @todo (lucas): change this
    chainId: 1337,
    crossChainId: 1337,
    crossChainName: "hardhat",
  },
};

export const isNetworkName = (str: string): str is NetworkName =>
  str in networkVariables;

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

  return network.name === "hardhat"
    ? localAddressConstants
    : testnetAddressConstants;
};
