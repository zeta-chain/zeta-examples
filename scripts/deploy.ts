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

  const crossChainWarriorsContract = await getCrossChainWarriors();

  (
    await crossChainWarriorsContract.setBaseURI(
      "https://gateway.pinata.cloud/ipfs/QmNRP9kZ2SJXnFnxwvhQbxQHQuXVWVive3JkCNgG6315iH/"
    )
  ).wait();

  if (network.name === "hardhat") {
    const filename = "../addressConstants.local.json";
    console.log("Creating", filename);

    addressConstants.hardhat.crossChainWarriorsAddress =
      crossChainWarriorsContract.address;

    writeFileSync(
      join(__dirname, filename),
      JSON.stringify(addressConstants, null, 2)
    );
  } else if (network.name === "bsctestnet") {
    const filename = "../addressConstants.testnet.json";
    console.log("Creating", filename);

    addressConstants.bsctestnet.crossChainWarriorsAddress =
      crossChainWarriorsContract.address;

    writeFileSync(
      join(__dirname, filename),
      JSON.stringify(addressConstants, null, 2)
    );
  } else if (network.name === "goerli") {
    const filename = "../addressConstants.testnet.json";
    console.log("Creating", filename);

    addressConstants.goerli.crossChainWarriorsAddress =
      crossChainWarriorsContract.address;

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
