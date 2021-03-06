// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../MultiChainValue.sol";

contract MultiChainValueMock is MultiChainValue {
    constructor(address _zetaMpiAddress, address _zetaTokenInput) MultiChainValue(_zetaMpiAddress, _zetaTokenInput) {}
}
