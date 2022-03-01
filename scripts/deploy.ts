import { writeFileSync } from "fs";
import { network } from "hardhat";
import { join } from "path";
import {
  getAddressConstants,
  isNetworkName,
} from "../lib/CrossChainWarriors.constants";
import { getCrossChainWarriors } from "../lib/CrossChainWarriors.helpers";

async function main() {
  if (!isNetworkName(network.name)) throw new Error("Invalid network name");

  const prevAddressConstants = getAddressConstants();

  const addressConstants = {
    bsctestnet: {
      crossChainWarriorsAddress:
        prevAddressConstants.bsctestnet.crossChainWarriorsAddress,
    },
    goerli: {
      crossChainWarriorsAddress:
        prevAddressConstants.goerli.crossChainWarriorsAddress,
    },
    hardhat: {
      crossChainWarriorsAddress:
        prevAddressConstants.hardhat.crossChainWarriorsAddress,
    },
  };

  const crossChainWarriorsAddress = await getCrossChainWarriors();

  if (network.name === "hardhat") {
    const filename = "../addressConstants.local.json";
    console.log("Creating", filename);

    addressConstants.hardhat.crossChainWarriorsAddress =
      crossChainWarriorsAddress.address;

    writeFileSync(
      join(__dirname, filename),
      JSON.stringify(addressConstants, null, 2)
    );
  } else if (network.name === "bsctestnet") {
    const filename = "../addressConstants.testnet.json";
    console.log("Creating", filename);

    addressConstants.bsctestnet.crossChainWarriorsAddress =
      crossChainWarriorsAddress.address;

    writeFileSync(
      join(__dirname, filename),
      JSON.stringify(addressConstants, null, 2)
    );
  } else if (network.name === "goerli") {
    const filename = "../addressConstants.testnet.json";
    console.log("Creating", filename);

    addressConstants.goerli.crossChainWarriorsAddress =
      crossChainWarriorsAddress.address;

    writeFileSync(
      join(__dirname, filename),
      JSON.stringify(addressConstants, null, 2)
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
