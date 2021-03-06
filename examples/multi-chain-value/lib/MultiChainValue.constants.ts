export type NetworkName = "bsctestnet" | "goerli" | "hardhat";

type ChainId = 5 | 97 | 1337;

export type NetworkVariables = {
  MPI_ADDRESS: string;
  ZETA_ADDRESS: string;
  chainId: ChainId;
  crossChainId: ChainId;
  crossChainName: NetworkName;
};

export const networkVariables: Record<NetworkName, NetworkVariables> = {
  bsctestnet: {
    MPI_ADDRESS: "0xE626402550fB921E4a47c11568F89dF3496fbEF0",
    ZETA_ADDRESS: "0x6Cc37160976Bbd1AecB5Cce4C440B28e883c7898",
    chainId: 97,
    crossChainId: 5,
    crossChainName: "goerli",
  },
  goerli: {
    MPI_ADDRESS: "0x68Bc806414e743D88436AEB771Be387A55B4df70",
    ZETA_ADDRESS: "0x91Ea4f79D39DA890B03E965111953d0494936072",
    chainId: 5,
    crossChainId: 97,
    crossChainName: "bsctestnet",
  },
  hardhat: {
    MPI_ADDRESS: "0x0000000000000000000000000000000000000000",
    ZETA_ADDRESS: "0x0000000000000000000000000000000000000000",
    chainId: 1337,
    crossChainId: 1337,
    crossChainName: "hardhat",
  },
};

export const isNetworkName = (str: string): str is NetworkName => str in networkVariables;
