// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@zetachain/contracts/ZetaInterfaces.sol";
import "@zetachain/contracts/ZetaReceiver.sol";

contract MultiChainValue is ZetaReceiver {
    address public zetaMpi;
    address public zetaToken;

    ZetaMPI internal _zetaMpi;
    IERC20 internal _zetaToken;

    constructor(address _zetaMpiInput, address _zetaTokenInput) {
        zetaMpi = _zetaMpiInput;
        zetaToken = _zetaTokenInput;

        _zetaMpi = ZetaMPI(_zetaMpiInput);
        _zetaToken = IERC20(_zetaTokenInput);
    }

    function onZetaMessage(ZetaInterfaces.ZetaMessage calldata _zetaMessage) external {
        //
    }

    function onZetaRevert(ZetaInterfaces.ZetaRevert calldata _zetaRevert) external {
        //
    }
}
