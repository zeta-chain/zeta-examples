import { expect } from "chai";
import { networkVariables } from "../lib/CrossChainWarriors.constants";

const GOERLI_CHAIN_ID = 5;
const BSC_TESTNET_CHAIN_ID = 97;

describe("lib tests", () => {
  describe("CrossChainWarriors.constants", () => {
    describe("bsctestnet", () => {
      it("Should have the correct variables", () => {
        expect(networkVariables.bsctestnet.MPI_ADDRESS).to.equal("0x96cE47e42A73649CFe33d93D93ACFbEc6FD5ee14");
        expect(networkVariables.bsctestnet.chainId).to.equal(BSC_TESTNET_CHAIN_ID);
        expect(networkVariables.bsctestnet.crossChainId).to.equal(GOERLI_CHAIN_ID);
      });
    });

    describe("goerli", () => {
      it("Should have the correct variables", () => {
        expect(networkVariables.goerli.MPI_ADDRESS).to.equal("0x132b042bD5198a48E4D273f46b979E5f13Bd9239");
        expect(networkVariables.goerli.chainId).to.equal(GOERLI_CHAIN_ID);
        expect(networkVariables.goerli.crossChainId).to.equal(BSC_TESTNET_CHAIN_ID);
      });
    });
  });

  describe("CrossChainWarriors.helpers", () => {
    //
  });
});
