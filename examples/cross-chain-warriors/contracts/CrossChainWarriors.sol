// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@zetachain/contracts/ZetaInterfaces.sol";
import "@zetachain/contracts/ZetaReceiver.sol";

contract CrossChainWarriors is ERC721("CrossChainWarriors", "CCWAR"), Ownable, ZetaReceiver {
    using Counters for Counters.Counter;
    using Strings for uint256;

    bytes32 public constant CROSS_CHAIN_TRANSFER_MESSAGE = keccak256("CROSS_CHAIN_TRANSFER");

    uint256 internal immutable _currentChainId;
    uint256 internal _crossChainId;
    bytes internal _crossChainAddress;

    address internal _zetaMpiAddress;
    ZetaMPI internal _zeta;

    IERC20 internal _zetaToken;

    string public baseURI;

    Counters.Counter public tokenIds;

    constructor(address _zetaMpiInputAddress, bool useEven) {
        _currentChainId = block.chainid;

        _zetaMpiAddress = _zetaMpiInputAddress;
        _zeta = ZetaMPI(_zetaMpiInputAddress);

        /**
         * @dev A simple way to prevent collisions between cross-chain token ids
         * As you can see below, the mint function should increase the counter by two
         */
        tokenIds.increment();
        if (useEven) tokenIds.increment();
    }

    function setCrossChainAddress(bytes calldata _ccAddress) public onlyOwner {
        _crossChainAddress = _ccAddress;
    }

    function setCrossChainId(uint256 _ccId) public onlyOwner {
        _crossChainId = _ccId;
    }

    function setBaseURI(string memory _baseURIParam) public onlyOwner {
        baseURI = _baseURIParam;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function mint(address to) public returns (uint256) {
        uint256 newWarriorId = tokenIds.current();
        _safeMint(to, newWarriorId);

        /**
         * @dev Always increment by two to keep ids even/odd (depending on the chain)
         * Check the constructor for further reference
         */
        tokenIds.increment();
        tokenIds.increment();

        return newWarriorId;
    }

    /**
     * @dev Useful for cross-chain minting
     */
    function _mintId(address to, uint256 tokenId) internal {
        _safeMint(to, tokenId);
    }

    function _burnWarrior(uint256 burnedWarriorId) internal {
        _burn(burnedWarriorId);
    }

    /**
     * @dev Cross-chain functions
     */

    function crossChainTransfer(address to, uint256 tokenId) external {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Transfer caller is not owner nor approved");

        _burnWarrior(tokenId);

        _zeta.send(
            ZetaInterfaces.SendInput({
                destinationChainId: _crossChainId,
                destinationAddress: _crossChainAddress,
                gasLimit: 2500000,
                message: abi.encode(CROSS_CHAIN_TRANSFER_MESSAGE, tokenId, msg.sender, to),
                zetaAmount: 0,
                zetaParams: abi.encode("")
            })
        );
    }

    function onZetaMessage(ZetaInterfaces.ZetaMessage calldata _zetaMessage) external {
        require(msg.sender == _zetaMpiAddress, "This function can only be called by the Zeta MPI contract");
        require(
            keccak256(_zetaMessage.originSenderAddress) == keccak256(_crossChainAddress),
            "Cross-chain address doesn't match"
        );
        require(_zetaMessage.originChainId == _crossChainId, "Cross-chain id doesn't match");

        (
            bytes32 messageType,
            uint256 tokenId,
            ,
            /**
             * @dev this extra comma corresponds to address from
             */
            address to
        ) = abi.decode(_zetaMessage.message, (bytes32, uint256, address, address));

        require(messageType == CROSS_CHAIN_TRANSFER_MESSAGE, "Invalid message type");

        _mintId(to, tokenId);
    }

    function onZetaRevert(ZetaInterfaces.ZetaRevert calldata _zetaRevert) external {
        require(msg.sender == _zetaMpiAddress, "This function can only be called by the Zeta MPI contract");
        require(_zetaRevert.originSenderAddress == address(this), "Invalid originSenderAddress");
        require(_zetaRevert.originChainId == _currentChainId, "Invalid originChainId");

        (bytes32 messageType, uint256 tokenId, address from) = abi.decode(
            _zetaRevert.message,
            (bytes32, uint256, address)
        );

        require(messageType == CROSS_CHAIN_TRANSFER_MESSAGE, "Invalid message type");

        _mintId(from, tokenId);
    }
}
