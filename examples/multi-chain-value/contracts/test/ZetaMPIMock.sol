// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@zetachain/contracts/ZetaInterfaces.sol";

contract ZetaMPIMock is ZetaMPI {
    function send(ZetaInterfaces.SendInput calldata input) external {}
}
