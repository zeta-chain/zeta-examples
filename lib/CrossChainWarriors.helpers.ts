import assert from "assert";
import { ethers, network } from "hardhat";
import {
  CrossChainWarriors,
  CrossChainWarriorsMock,
  CrossChainWarriorsMock__factory as CrossChainWarriorsMockFactory,
  CrossChainWarriors__factory as CrossChainWarriorsFactory,
  ZetaMPIMock,
  ZetaMPIMock__factory as ZetaMPIMockFactory,
} from "../typechain";
import {
  isNetworkName,
  networkVariables,
} from "./CrossChainWarriors.constants";

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

  assert(
    isLocalEnvironment,
    "localDeployCrossChainWarriors is only intended to be used in the local environment"
  );

  const Factory = (await ethers.getContractFactory(
    "CrossChainWarriorsMock"
  )) as CrossChainWarriorsMockFactory;

  const useEven = customUseEven;

  const crossChainWarriorsContract = (await Factory.deploy(
    zetaMPIMockAddress,
    zetaMPIMockAddress, // @todo (lucas): replace this for zeta token (or remove zeta token from the constructor)
    useEven
  )) as CrossChainWarriorsMock;

  await crossChainWarriorsContract.deployed();

  return crossChainWarriorsContract;
};

export const deployCrossChainWarriors = async () => {
  assert(isNetworkName(network.name), "Invalid network name");

  const _networkVariables = networkVariables[network.name];

  const Factory = (await ethers.getContractFactory(
    "CrossChainWarriors"
  )) as CrossChainWarriorsFactory;

  const useEven = network.name === "goerli";

  const crossChainWarriorsContract = (await Factory.deploy(
    _networkVariables.MPI_ADDRESS,
    _networkVariables.ZETA_TOKEN_ADDRESS,
    useEven
  )) as CrossChainWarriors;

  await crossChainWarriorsContract.deployed();

  return crossChainWarriorsContract;
};

export const deployZetaMPIMock = async () => {
  const Factory = (await ethers.getContractFactory(
    "ZetaMPIMock"
  )) as ZetaMPIMockFactory;

  const zetaMPIMockContract = (await Factory.deploy()) as ZetaMPIMock;

  await zetaMPIMockContract.deployed();

  return zetaMPIMockContract;
};
