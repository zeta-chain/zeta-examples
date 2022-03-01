import assert from "assert";
import { ethers, network } from "hardhat";
import {
  CrossChainWarriors,
  CrossChainWarriors__factory as CrossChainWarriorsFactory,
} from "../typechain";
import {
  isNetworkName,
  networkVariables,
} from "./CrossChainWarriors.constants";

export const deployCrossChainWarriors = async ({
  customUseEven,
}: {
  /**
   * @description only for testing
   */
  customUseEven?: boolean;
} = {}) => {
  assert(isNetworkName(network.name), "Invalid network name");
  assert(
    network.name === "hardhat" || typeof customUseEven === "undefined",
    "customUseEven is only intended to be used in local network"
  );

  const _networkVariables = networkVariables[network.name];

  const CrossChainWarriorsFactory = (await ethers.getContractFactory(
    "CrossChainWarriors"
  )) as CrossChainWarriorsFactory;

  const useEven = customUseEven ?? network.name === "goerli";

  const crossChainWarriorsContract = (await CrossChainWarriorsFactory.deploy(
    _networkVariables.MPI_ADDRESS,
    _networkVariables.ZETA_TOKEN_ADDRESS,
    useEven
  )) as CrossChainWarriors;

  await crossChainWarriorsContract.deployed();

  return crossChainWarriorsContract;
};
