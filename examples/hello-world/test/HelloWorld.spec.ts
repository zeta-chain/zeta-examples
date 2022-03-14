import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployHelloWorldMock, deployZetaMPIMock } from "../lib/HelloWorld.helpers";
import { HelloWorldMock, ZetaMPIMock } from "../typechain";

describe("HelloWorld tests", () => {
  let helloWorldContractA: HelloWorldMock;
  const chainAId = 1;

  let helloWorldContractB: HelloWorldMock;
  const chainBId = 2;

  let zetaMPIMockContract: ZetaMPIMock;

  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let account1: SignerWithAddress;
  let deployerAddress: string;
  let account1Address: string;

  const encoder = new ethers.utils.AbiCoder();

  beforeEach(async () => {
    zetaMPIMockContract = await deployZetaMPIMock();
    helloWorldContractA = await deployHelloWorldMock({
      zetaMPIMockAddress: zetaMPIMockContract.address,
    });
    helloWorldContractB = await deployHelloWorldMock({
      zetaMPIMockAddress: zetaMPIMockContract.address,
    });

    await helloWorldContractA.setCrossChainAddress(encoder.encode(["address"], [helloWorldContractB.address]));
    await helloWorldContractB.setCrossChainAddress(encoder.encode(["address"], [helloWorldContractA.address]));
    await helloWorldContractA.setCrossChainID(chainBId);
    await helloWorldContractB.setCrossChainID(chainAId);

    accounts = await ethers.getSigners();
    [deployer, account1] = accounts;
    deployerAddress = deployer.address;
    account1Address = account1.address;
  });

  describe("counter", () => {
    it("Should increment the counter of the address provided as param", async () => {
      const initialValue = await helloWorldContractA.counter(deployerAddress);
      expect(initialValue).to.equal(0);

      await (await helloWorldContractA.increment(deployerAddress)).wait();

      const incrementValue = await helloWorldContractA.counter(deployerAddress);
      expect(incrementValue).to.equal(1);
    });
  });

  describe("crossChainCount", () => {
    it("Should revert if the cross chain address wasn't set", async () => {
      const unsetContract = await deployHelloWorldMock({
        zetaMPIMockAddress: zetaMPIMockContract.address,
      });

      await expect(unsetContract.crossChainCount()).to.be.revertedWith("Cross-chain address is not set");
    });

    it("Should revert if the cross chain id wasn't set", async () => {
      const unsetContract = await deployHelloWorldMock({
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
