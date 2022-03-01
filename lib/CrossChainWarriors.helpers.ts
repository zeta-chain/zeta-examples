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

export const deployCrossChainWarriors = async <
  GetMockInstance extends boolean
>({
  customUseEven,
  getMockInstance,
  zetaMPIMockAddress,
}: {
  /**
   * @description only for testing
   */
  customUseEven?: boolean;
  /**
   * @description only for testing
   */
  getMockInstance?: GetMockInstance;
  /**
   * @description only for testing
   */
  zetaMPIMockAddress?: string;
} = {}): Promise<
  GetMockInstance extends true
    ? Promise<CrossChainWarriorsMock>
    : Promise<CrossChainWarriors>
> => {
  const isLocalEnvironment = network.name === "hardhat";

  assert(isNetworkName(network.name), "Invalid network name");
  assert(
    isLocalEnvironment || typeof customUseEven === "undefined",
    "customUseEven is only intended to be used in local network"
  );
  assert(
    isLocalEnvironment || typeof getMockInstance === "undefined",
    "getMockInstance is only intended to be used in local network"
  );
  assert(
    isLocalEnvironment || typeof zetaMPIMockAddress === "undefined",
    "zetaMPIMockAddress is only intended to be used in local network"
  );

  const _networkVariables = networkVariables[network.name];

  const Factory = (await ethers.getContractFactory(
    getMockInstance ? "CrossChainWarriorsMock" : "CrossChainWarriors"
  )) as CrossChainWarriorsFactory | CrossChainWarriorsMockFactory;

  const useEven = customUseEven ?? network.name === "goerli";

  const crossChainWarriorsContract = (await Factory.deploy(
    zetaMPIMockAddress || _networkVariables.MPI_ADDRESS,
    _networkVariables.ZETA_TOKEN_ADDRESS,
    useEven
  )) as CrossChainWarriors | CrossChainWarriorsMock;

  await crossChainWarriorsContract.deployed();

  return crossChainWarriorsContract;
};

export const a = () => {};

export const deployZetaMPIMock = async () => {
  const Factory = (await ethers.getContractFactory(
    "ZetaMPIMock"
  )) as ZetaMPIMockFactory;

  const zetaMPIMockContract = (await Factory.deploy()) as ZetaMPIMock;

  await zetaMPIMockContract.deployed();

  return zetaMPIMockContract;
};
