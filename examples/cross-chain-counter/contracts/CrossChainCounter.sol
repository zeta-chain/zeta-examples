// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./ZetaMPI.sol";

contract CrossChainCounter {
    address internal _zetaMpiAddress;
    ZetaMPI internal _zetaMpi;

    constructor(
        address _zetaMpiInputAddress
    ) {
        _zetaMpiAddress = _zetaMpiInputAddress;
        _zetaMpi = ZetaMPI(_zetaMpiInputAddress);
    }
}
