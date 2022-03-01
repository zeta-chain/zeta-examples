// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../shared/ZetaMPI.sol";

contract ZetaMPIMock is ZetaMPI {
    function zetaMessageSend(
        uint16 destChainID,
        bytes calldata destContract,
        uint256 zetaAmount,
        uint256 gasLimit,
        bytes calldata message,
        bytes calldata zetaParams
    ) external {}
}
