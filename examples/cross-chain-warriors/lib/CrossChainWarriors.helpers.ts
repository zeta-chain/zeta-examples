import assert from "assert";
import { ethers, network } from "hardhat";
import {
  CrossChainWarriors,
  CrossChainWarriorsMock,
  CrossChainWarriorsMock__factory as CrossChainWarriorsMockFactory,
  CrossChainWarriors__factory as CrossChainWarriorsFactory,
  CrossChainWarriorsZetaMPIMock,
  CrossChainWarriorsZetaMPIMock__factory as CrossChainWarriorsZetaMPIMockFactory,
} from "../typechain";
import { isNetworkName, networkVariables } from "./CrossChainWarriors.constants";

/**
 * @description only for testing or local environment
 */
export const deployCrossChainWarriorsMock = async ({
  customUseEven,
  zetaMPIMockAddress,
}: {
  customUseEven: boolean;
  zetaMPIMockAddress: string;
}) => {
  const isLocalEnvironment = network.name === "hardhat";

  assert(isLocalEnvironment, "localDeployCrossChainWarriors is only intended to be used in the local environment");

  const Factory = (await ethers.getContractFactory("CrossChainWarriorsMock")) as CrossChainWarriorsMockFactory;

  const useEven = customUseEven;

  const crossChainWarriorsContract = (await Factory.deploy(zetaMPIMockAddress, useEven)) as CrossChainWarriorsMock;

  await crossChainWarriorsContract.deployed();

  return crossChainWarriorsContract;
};

export const getCrossChainWarriors = async (existingContractAddress?: string) => {
  if (!isNetworkName(network.name)) throw new Error("Invalid network name");
  const isGetExistingContract = typeof existingContractAddress !== "undefined";

  const _networkVariables = networkVariables[network.name];

  const Factory = (await ethers.getContractFactory("CrossChainWarriors")) as CrossChainWarriorsFactory;

  if (isGetExistingContract) {
    console.log("Getting existing Cross Chain Warriors");
    return Factory.attach(existingContractAddress) as CrossChainWarriors;
  }

  const useEven = network.name === "goerli";

  console.log("Deploying Cross Chain Warriors");
  const crossChainWarriorsContract = (await Factory.deploy(
    _networkVariables.MPI_ADDRESS,
    useEven
  )) as CrossChainWarriors;

  await crossChainWarriorsContract.deployed();

  return crossChainWarriorsContract;
};

export const deployZetaMPIMock = async () => {
  const Factory = (await ethers.getContractFactory(
    "CrossChainWarriorsZetaMPIMock"
  )) as CrossChainWarriorsZetaMPIMockFactory;

  const zetaMPIMockContract = (await Factory.deploy()) as CrossChainWarriorsZetaMPIMock;

  await zetaMPIMockContract.deployed();

  return zetaMPIMockContract;
};
