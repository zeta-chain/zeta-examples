// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./ZetaInterfaces.sol";

interface ZetaReceiver {
    function onZetaMessage(ZetaInterfaces.ZetaMessage calldata _zetaMessage) external;

    function onZetaRevert(ZetaInterfaces.ZetaRevert calldata _zetaRevert) external;
}
