// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface ZetaInterfaces {
    /**
     * @dev Use SendInput to interact with our Message Passing Interface: zeta.send(SendInput)
     */
    struct SendInput {
        uint256 destinationChainId;
        bytes destinationAddress;
        /// @dev Total gas including the transactions on every chain
        uint256 gasLimit;
        /// @dev An encoded, arbitrary message to be parsed by the destination contract
        bytes message;
        /// @dev The amount of Zeta that you wanna send cross-chain, greater than or equal to 0
        uint256 zetaAmount;
        /// @dev Optional parameters for the Zeta protocol
        bytes zetaParams;
    }

    /**
     * @dev Our Message Passing Interface will call your contract's onReceive using this interface
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
