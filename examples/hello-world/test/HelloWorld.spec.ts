import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployTestHelloWorld, deployZetaMPIMock } from "../lib/HelloWorld.helpers";
import { HelloWorld, ZetaMPIMock } from "../typechain";

describe("HelloWorld tests", () => {
  let helloWorldContractA: HelloWorld;
  const chainAId = 1;

  let helloWorldContractB: HelloWorld;
  const chainBId = 2;

  let zetaMPIMockContract: ZetaMPIMock;

  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let deployerAddress: string;

  const encoder = new ethers.utils.AbiCoder();

  beforeEach(async () => {
    zetaMPIMockContract = await deployZetaMPIMock();
    helloWorldContractA = await deployTestHelloWorld({
      zetaMPIMockAddress: zetaMPIMockContract.address,
    });
    helloWorldContractB = await deployTestHelloWorld({
      zetaMPIMockAddress: zetaMPIMockContract.address,
    });

    await helloWorldContractA.setCrossChainAddress(encoder.encode(["address"], [helloWorldContractB.address]));
    await helloWorldContractB.setCrossChainAddress(encoder.encode(["address"], [helloWorldContractA.address]));
    await helloWorldContractA.setCrossChainID(chainBId);
    await helloWorldContractB.setCrossChainID(chainAId);

    accounts = await ethers.getSigners();
    [deployer] = accounts;
    deployerAddress = deployer.address;
  });

  describe("crossChainCount", () => {
    it("Should revert if the cross chain address wasn't set", async () => {
      const unsetContract = await deployTestHelloWorld({
        zetaMPIMockAddress: zetaMPIMockContract.address,
      });

      await expect(unsetContract.crossChainCount()).to.be.revertedWith("Cross-chain address is not set");
    });

    it("Should revert if the cross chain id wasn't set", async () => {
      const unsetContract = await deployTestHelloWorld({
        zetaMPIMockAddress: zetaMPIMockContract.address,
      });

      await unsetContract.setCrossChainAddress(encoder.encode(["address"], [helloWorldContractB.address]));

      await expect(unsetContract.crossChainCount()).to.be.revertedWith("Cross-chain ID is not set");
    });
  });

  describe("uponZetaMessage", () => {
    it("Should revert if the caller is not the Zeta MPI contract", async () => {
      await expect(
        helloWorldContractA.uponZetaMessage(
          encoder.encode(["address"], [helloWorldContractA.address]),
          1,
          helloWorldContractB.address,
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
          helloWorldContractB.address,
          0,
          encoder.encode(["address"], [zetaMPIMockContract.address])
        )
      ).to.be.revertedWith("Cross-chain address doesn't match");
    });

    /**
     * @todo (lucas): re-enable cross-chain id check
     */
    // it("Should revert if the cross-chain id doesn't match with the stored one", async () => {
    //   await expect(
    //     zetaMPIMockContract.callUponZetaMessage(
    //       encoder.encode(["address"], [helloWorldContractA.address]),
    //       2,
    //       helloWorldContractB.address,
    //       0,
    //       encoder.encode(["address"], [zetaMPIMockContract.address])
    //     )
    //   ).to.be.revertedWith("Cross-chain id doesn't match");
    // });

    describe("Given a valid message", () => {
      it("Should increment the counter", async () => {
        const messageType = await helloWorldContractA.CROSS_CHAIN_INCREMENT_MESSAGE();

        const originalValue = await helloWorldContractB.counter(deployerAddress);
        expect(originalValue.toNumber()).to.equal(0);

        await (
          await zetaMPIMockContract.callUponZetaMessage(
            encoder.encode(["address"], [helloWorldContractA.address]),
            1,
            helloWorldContractB.address,
            0,
            encoder.encode(["bytes32", "address"], [messageType, deployer.address])
          )
        ).wait();

        const newValue = await helloWorldContractB.counter(deployerAddress);
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
