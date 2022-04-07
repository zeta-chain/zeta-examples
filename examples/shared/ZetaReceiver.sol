// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./ZetaInterfaces.sol";

interface ZetaReceiver {
    /**
     * @dev onReceive will be called when a cross-chain message is delivered to your contract
     */
    function onZetaMessage(ZetaInterfaces.ZetaMessage calldata _zetaMessage) external;

    /**
     * @dev onRevert will be called when a cross-chain message reverts
     * It's useful to rollback your contract's state
     */
    function onZetaRevert(ZetaInterfaces.ZetaRevert calldata _zetaRevert) external;
}
