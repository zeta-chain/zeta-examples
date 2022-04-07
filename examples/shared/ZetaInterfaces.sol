// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ZetaInterfaces {
    /**
     * @dev Use SendInput to interact with our Message Passing Interface: zeta.send(SendInput)
     */
    struct SendInput {
        uint256 destinationChainId;
        bytes destinationAddress;
        uint256 gasLimit;
        bytes message;
        uint256 zetaAmount;
        bytes zetaParams;
    }

    /**
     * @dev Our Message Passing Interface will call your contract's onReceive using this interface
     * onReceive will be called when a cross-chain message is delivered to your contract
     */
    struct ZetaMessage {
        bytes originSenderAddress;
        uint256 originChainId;
        address destinationAddress;
        uint256 zetaAmount;
        bytes message;
    }

    /**
     * @dev Our Message Passing Interface will call your contract's onRevert using this interface
     * onRevert will be called when a cross-chain message reverted and it's useful to recover to the original state
     */
    struct ZetaRevert {
        address originSenderAddress;
        uint256 originChainId;
        bytes destinationAddress;
        uint256 destinationChainId;
        uint256 zetaAmount;
        bytes message;
    }
}

interface ZetaMPI {
    /**
     * @dev Sending value and data cross-chain is as easy as calling zeta.send(SendInput)
     */
    function send(ZetaInterfaces.SendInput calldata input) external;
}
