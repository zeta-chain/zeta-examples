import { network } from "hardhat";
import { getAddressConstants, isNetworkName, networkVariables } from "../lib/CrossChainWarriors.constants";
import { getCrossChainWarriors } from "../lib/CrossChainWarriors.helpers";

async function main() {
  if (!isNetworkName(network.name)) throw new Error("Invalid network name");

  const addressConstants = getAddressConstants();
  const _networkVariables = networkVariables[network.name];

  const crossChainWarriorsContract = await getCrossChainWarriors(
    addressConstants[network.name].crossChainWarriorsAddress
  );

  const crossChainAddress = addressConstants[_networkVariables.crossChainName].crossChainWarriorsAddress;

  console.log("Setting cross-chain address:", crossChainAddress);

  (await crossChainWarriorsContract.setCrossChainAddress(crossChainAddress)).wait();

  console.log("Setting cross-chain id:", _networkVariables.crossChainId);

  (await crossChainWarriorsContract.setCrossChainID(_networkVariables.crossChainId)).wait();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
