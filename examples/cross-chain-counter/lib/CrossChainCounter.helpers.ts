import assert from "assert";
import { ethers, network } from "hardhat";
import {
  CrossChainCounter__factory as CrossChainCounterFactory,
  CrossChainCounter,
  ZetaMPIMock,
  ZetaMPIMock__factory as ZetaMPIMockFactory,
} from "../typechain";
import { isNetworkName, networkVariables } from "./CrossChainCounter.constants";

/**
 * @description only for testing or local environment
 */
export const deployTestCrossChainCounter = async ({ zetaMPIMockAddress }: { zetaMPIMockAddress: string }) => {
  const isLocalEnvironment = network.name === "hardhat";

  assert(isLocalEnvironment, "This function is only intended to be used in the local environment");

  const Factory = (await ethers.getContractFactory("CrossChainCounter")) as CrossChainCounterFactory;

  const crossChainCounterContract = (await Factory.deploy(zetaMPIMockAddress)) as CrossChainCounter;

  await crossChainCounterContract.deployed();

  return crossChainCounterContract;
};

export const getCrossChainCounter = async (existingContractAddress?: string) => {
  if (!isNetworkName(network.name)) throw new Error("Invalid network name");
  const isGetExistingContract = typeof existingContractAddress !== "undefined";

  const _networkVariables = networkVariables[network.name];

  const Factory = (await ethers.getContractFactory("CrossChainCounter")) as CrossChainCounterFactory;

  if (isGetExistingContract) {
    console.log("Getting existing CrossChainCounter");
    return Factory.attach(existingContractAddress) as CrossChainCounter;
  }

  console.log("Deploying CrossChainCounter");
  const crossChainCounterContract = (await Factory.deploy(_networkVariables.MPI_ADDRESS)) as CrossChainCounter;

  await crossChainCounterContract.deployed();

  return crossChainCounterContract;
};

export const deployZetaMPIMock = async () => {
  const Factory = (await ethers.getContractFactory("ZetaMPIMock")) as ZetaMPIMockFactory;

  const zetaMPIMockContract = (await Factory.deploy()) as ZetaMPIMock;

  await zetaMPIMockContract.deployed();

  return zetaMPIMockContract;
};
