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

  const crossChainWarriorsContract = await getCrossChainWarriors(
    addressConstants[network.name].crossChainWarriorsAddress
  );

  const crossChainAddress =
    addressConstants[_networkVariables.crossChainName]
      .crossChainWarriorsAddress;

  (
    await crossChainWarriorsContract.setCrossChainAddress(crossChainAddress)
  ).wait();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
