import assert from "assert";
import { ethers, network } from "hardhat";
import {
  HelloWorld__factory as HelloWorldFactory,
  HelloWorld,
  ZetaMPIMock,
  ZetaMPIMock__factory as ZetaMPIMockFactory,
} from "../typechain";
import { isNetworkName, networkVariables } from "./HelloWorld.constants";

/**
 * @description only for testing or local environment
 */
export const deployTestHelloWorld = async ({ zetaMPIMockAddress }: { zetaMPIMockAddress: string }) => {
  const isLocalEnvironment = network.name === "hardhat";

  assert(isLocalEnvironment, "This function is only intended to be used in the local environment");

  const Factory = (await ethers.getContractFactory("HelloWorld")) as HelloWorldFactory;

  const helloWorldContract = (await Factory.deploy(zetaMPIMockAddress)) as HelloWorld;

  await helloWorldContract.deployed();

  return helloWorldContract;
};

export const getHelloWorld = async (existingContractAddress?: string) => {
  if (!isNetworkName(network.name)) throw new Error("Invalid network name");
  const isGetExistingContract = typeof existingContractAddress !== "undefined";

  const _networkVariables = networkVariables[network.name];

  const Factory = (await ethers.getContractFactory("HelloWorld")) as HelloWorldFactory;

  if (isGetExistingContract) {
    console.log("Getting existing HelloWorld");
    return Factory.attach(existingContractAddress) as HelloWorld;
  }

  console.log("Deploying HelloWorld");
  const helloWorldContract = (await Factory.deploy(_networkVariables.MPI_ADDRESS)) as HelloWorld;

  await helloWorldContract.deployed();

  return helloWorldContract;
};

export const deployZetaMPIMock = async () => {
  const Factory = (await ethers.getContractFactory("ZetaMPIMock")) as ZetaMPIMockFactory;

  const zetaMPIMockContract = (await Factory.deploy()) as ZetaMPIMock;

  await zetaMPIMockContract.deployed();

  return zetaMPIMockContract;
};
