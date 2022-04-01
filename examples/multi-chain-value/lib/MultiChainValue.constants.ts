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
    MPI_ADDRESS: "0x96cE47e42A73649CFe33d93D93ACFbEc6FD5ee14",
    chainId: 97,
    crossChainId: 5,
    crossChainName: "goerli",
  },
  goerli: {
    MPI_ADDRESS: "0x132b042bD5198a48E4D273f46b979E5f13Bd9239",
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
