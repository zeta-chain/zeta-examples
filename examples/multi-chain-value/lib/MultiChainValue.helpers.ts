import assert from "assert";
import { ethers, network } from "hardhat";
import {
  MultiChainValueMock__factory as MultiChainValueMockFactory,
  MultiChainValueMock,
  MultiChainValue__factory as MultiChainValueFactory,
  MultiChainValue,
  ZetaMPIMock,
  ZetaMPIMock__factory as ZetaMPIMockFactory,
  ZetaEth__factory,
  ZetaEth,
} from "../typechain";
import { isNetworkName, networkVariables } from "./MultiChainValue.constants";

/**
 * @description only for testing or local environment
 */
export const deployMultiChainValueMock = async ({
  zetaMPIMockAddress,
  zetaTokenMockAddress,
}: {
  zetaMPIMockAddress: string;
  zetaTokenMockAddress: string;
}) => {
  const isLocalEnvironment = network.name === "hardhat";

  assert(isLocalEnvironment, "This function is only intended to be used in the local environment");

  const Factory = (await ethers.getContractFactory("MultiChainValueMock")) as MultiChainValueMockFactory;

  const multiChainValueContract = (await Factory.deploy(
    zetaMPIMockAddress,
    zetaTokenMockAddress
  )) as MultiChainValueMock;

  await multiChainValueContract.deployed();

  return multiChainValueContract;
};

export const getMultiChainValue = async (existingContractAddress?: string) => {
  if (!isNetworkName(network.name)) throw new Error("Invalid network name");
  const isGetExistingContract = typeof existingContractAddress !== "undefined";

  const _networkVariables = networkVariables[network.name];

  const Factory = (await ethers.getContractFactory("MultiChainValue")) as MultiChainValueFactory;

  if (isGetExistingContract) {
    console.log("Getting existing MultiChainValue");
    return Factory.attach(existingContractAddress) as MultiChainValue;
  }

  console.log("Deploying MultiChainValue");
  const multiChainValueContract = (await Factory.deploy(
    _networkVariables.MPI_ADDRESS,
    _networkVariables.ZETA_ADDRESS
  )) as MultiChainValue;

  await multiChainValueContract.deployed();

  return multiChainValueContract;
};

export const deployZetaMPIMock = async () => {
  const Factory = (await ethers.getContractFactory("ZetaMPIMock")) as ZetaMPIMockFactory;

  const zetaMPIMockContract = (await Factory.deploy()) as ZetaMPIMock;

  await zetaMPIMockContract.deployed();

  return zetaMPIMockContract;
};

export const deployZetaEthMock = async () => {
  const Factory = (await ethers.getContractFactory("ZetaEth")) as ZetaEth__factory;

  const zetaMPIMockContract = (await Factory.deploy(100_000)) as ZetaEth;

  await zetaMPIMockContract.deployed();

  return zetaMPIMockContract;
};
