// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ZetaInterfaces {
    struct SendInput {
        uint16 destinationChainId;
        bytes destinationAddress;
        uint256 gasLimit;
        bytes message;
        uint256 zetaAmount;
        bytes zetaParams;
    }

    struct ZetaMessage {
        bytes originSenderAddress;
        uint16 originChainId;
        address destinationAddress;
        uint256 zetaAmount;
        bytes message;
    }

    struct ZetaRevert {
        address originSenderAddress;
        bytes destinationAddress;
        uint16 destinationChainId;
        uint256 zetaAmount;
        bytes message;
    }
}

interface ZetaMPI {
    function send(ZetaInterfaces.SendInput calldata _input) external;
}
