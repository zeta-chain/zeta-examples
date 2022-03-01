import { network } from "hardhat";
import {
  getAddressConstants,
  isNetworkName,
  networkVariables,
} from "../lib/CrossChainWarriors.constants";
import { getCrossChainWarriors } from "../lib/CrossChainWarriors.helpers";

async function main() {
  if (!isNetworkName(network.name)) throw new Error("Invalid network name");

  const addressConstants = getAddressConstants();
  const _networkVariables = networkVariables[network.name];

  const crossChainWarriorsContract = getCrossChainWarriors(
    addressConstants[network.name].crossChainWarriorsAddress
  );

  // const crossChainWarriorsAddress = _networkVariables.crossChainName
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
