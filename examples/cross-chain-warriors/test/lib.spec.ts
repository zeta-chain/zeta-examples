import { expect } from "chai";
import { networkVariables } from "../lib/CrossChainWarriors.constants";

const GOERLI_CHAIN_ID = 5;
const BSC_TESTNET_CHAIN_ID = 97;

describe("lib tests", () => {
  describe("CrossChainWarriors.constants", () => {
    describe("bsctestnet", () => {
      it("Should have the correct variables", () => {
        expect(networkVariables.bsctestnet.MPI_ADDRESS).to.equal("0xE626402550fB921E4a47c11568F89dF3496fbEF0");
        expect(networkVariables.bsctestnet.chainId).to.equal(BSC_TESTNET_CHAIN_ID);
        expect(networkVariables.bsctestnet.crossChainId).to.equal(GOERLI_CHAIN_ID);
      });
    });

    describe("goerli", () => {
      it("Should have the correct variables", () => {
        expect(networkVariables.goerli.MPI_ADDRESS).to.equal("0x68Bc806414e743D88436AEB771Be387A55B4df70");
        expect(networkVariables.goerli.chainId).to.equal(GOERLI_CHAIN_ID);
        expect(networkVariables.goerli.crossChainId).to.equal(BSC_TESTNET_CHAIN_ID);
      });
    });
  });
});
