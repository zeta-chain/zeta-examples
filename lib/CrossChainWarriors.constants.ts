export type NetworkName = "bsctestnet" | "goerli" | "hardhat";

export type NetworkVariables = {
  MPI_ADDRESS: string;
  ZETA_TOKEN_ADDRESS: string;
};

export const networkVariables: Record<NetworkName, NetworkVariables> = {
  bsctestnet: {
    MPI_ADDRESS: "0x96cE47e42A73649CFe33d93D93ACFbEc6FD5ee14",
    ZETA_TOKEN_ADDRESS: "0x4Ce8B40F7b64Ce5A5EbAc2349BAb6Ea0EBCC2240",
  },
  goerli: {
    MPI_ADDRESS: "0x132b042bD5198a48E4D273f46b979E5f13Bd9239",
    ZETA_TOKEN_ADDRESS: "0x88Be1F872F0A9B04961eBf3f8Bb998417EE8D54E",
  },
  hardhat: {
    MPI_ADDRESS: "0x96cE47e42A73649CFe33d93D93ACFbEc6FD5ee14", // @todo (lucas): change this
    ZETA_TOKEN_ADDRESS: "0x88Be1F872F0A9B04961eBf3f8Bb998417EE8D54E", // @todo (lucas): change this
  },
};

export const isNetworkName = (str: string): str is NetworkName =>
  str in networkVariables;
