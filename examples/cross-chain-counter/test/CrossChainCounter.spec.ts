import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployTestCrossChainCounter, deployZetaMPIMock } from "../lib/CrossChainCounter.helpers";
import { CrossChainCounter, ZetaMPIMock } from "../typechain";

describe("CrossChainCounter tests", () => {
  let crossChainCounterContractA: CrossChainCounter;
  const chainAId = 1;

  let crossChainCounterContractB: CrossChainCounter;
  const chainBId = 2;

  let zetaMPIMockContract: ZetaMPIMock;

  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let deployerAddress: string;

  const encoder = new ethers.utils.AbiCoder();

  beforeEach(async () => {
    zetaMPIMockContract = await deployZetaMPIMock();
    crossChainCounterContractA = await deployTestCrossChainCounter({
      zetaMPIMockAddress: zetaMPIMockContract.address,
    });
    crossChainCounterContractB = await deployTestCrossChainCounter({
      zetaMPIMockAddress: zetaMPIMockContract.address,
    });

    await crossChainCounterContractA.setCrossChainAddress(
      encoder.encode(["address"], [crossChainCounterContractB.address])
    );
    await crossChainCounterContractB.setCrossChainAddress(
      encoder.encode(["address"], [crossChainCounterContractA.address])
    );
    await crossChainCounterContractA.setCrossChainID(chainBId);
    await crossChainCounterContractB.setCrossChainID(chainAId);

    accounts = await ethers.getSigners();
    [deployer] = accounts;
    deployerAddress = deployer.address;
  });

  describe("crossChainCount", () => {
    it("Should revert if the cross chain address wasn't set", async () => {
      const unsetContract = await deployTestCrossChainCounter({
        zetaMPIMockAddress: zetaMPIMockContract.address,
      });

      await expect(unsetContract.crossChainCount()).to.be.revertedWith("Cross-chain address is not set");
    });

    it("Should revert if the cross chain id wasn't set", async () => {
      const unsetContract = await deployTestCrossChainCounter({
        zetaMPIMockAddress: zetaMPIMockContract.address,
      });

      await unsetContract.setCrossChainAddress(encoder.encode(["address"], [crossChainCounterContractB.address]));

      await expect(unsetContract.crossChainCount()).to.be.revertedWith("Cross-chain ID is not set");
    });
  });

  describe("uponZetaMessage", () => {
    it("Should revert if the caller is not the Zeta MPI contract", async () => {
      await expect(
        crossChainCounterContractA.uponZetaMessage(
          encoder.encode(["address"], [crossChainCounterContractA.address]),
          1,
          crossChainCounterContractB.address,
          0,
          encoder.encode(["address"], [deployerAddress])
        )
      ).to.be.revertedWith("This function can only be called by the Zeta MPI contract");
    });

    it("Should revert if the cross-chain address doesn't match with the stored one", async () => {
      await expect(
        zetaMPIMockContract.callUponZetaMessage(
          encoder.encode(["address"], [deployerAddress]),
          1,
          crossChainCounterContractB.address,
          0,
          encoder.encode(["address"], [zetaMPIMockContract.address])
        )
      ).to.be.revertedWith("Cross-chain address doesn't match");
    });

    describe("Given a valid message", () => {
      it("Should increment the counter", async () => {
        const messageType = await crossChainCounterContractA.CROSS_CHAIN_INCREMENT_MESSAGE();

        const originalValue = await crossChainCounterContractB.counter(deployerAddress);
        expect(originalValue.toNumber()).to.equal(0);

        await (
          await zetaMPIMockContract.callUponZetaMessage(
            encoder.encode(["address"], [crossChainCounterContractA.address]),
            1,
            crossChainCounterContractB.address,
            0,
            encoder.encode(["bytes32", "address"], [messageType, deployer.address])
          )
        ).wait();

        const newValue = await crossChainCounterContractB.counter(deployerAddress);
        expect(newValue.toNumber()).to.equal(1);
      });
    });
  });

  /**
   * @todo (lucas): implement
   */
  describe("zetaMessageRevert", () => {
    // it("Should work", async () => {
    //   expect(true).to.equal(true);
    // });
  });
});
