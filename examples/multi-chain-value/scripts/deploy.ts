import { writeFileSync } from "fs";
import { network } from "hardhat";
import { join } from "path";
import { getMultiChainValue } from "../lib/MultiChainValue.helpers";
import { getAddressConstants } from "../lib/networks";

async function main() {
  const prevAddressConstants = getAddressConstants();

  const addressConstants = {
    bsctestnet: {
      multiChainValueAddress: prevAddressConstants.bsctestnet.multiChainValueAddress,
    },
    goerli: {
      multiChainValueAddress: prevAddressConstants.goerli.multiChainValueAddress,
    },
    hardhat: {
      multiChainValueAddress: prevAddressConstants.hardhat.multiChainValueAddress,
    },
  };

  const multiChainValueContract = await getMultiChainValue();

  const goerli = 5;
  await (await multiChainValueContract.addAvailableChainId(goerli)).wait();

  const bsctestnet = 97;
  await (await multiChainValueContract.addAvailableChainId(bsctestnet)).wait();

  if (network.name === "hardhat") {
    const filename = "../addressConstants.local.json";
    console.log("Updating", filename);

    addressConstants.hardhat.multiChainValueAddress = multiChainValueContract.address;

    writeFileSync(join(__dirname, filename), JSON.stringify(addressConstants, null, 2));
  } else if (network.name === "bsctestnet") {
    const filename = "../addressConstants.testnet.json";
    console.log("Updating", filename);

    addressConstants.bsctestnet.multiChainValueAddress = multiChainValueContract.address;

    writeFileSync(join(__dirname, filename), JSON.stringify(addressConstants, null, 2));
  } else if (network.name === "goerli") {
    const filename = "../addressConstants.testnet.json";
    console.log("Updating", filename);

    addressConstants.goerli.multiChainValueAddress = multiChainValueContract.address;

    writeFileSync(join(__dirname, filename), JSON.stringify(addressConstants, null, 2));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
