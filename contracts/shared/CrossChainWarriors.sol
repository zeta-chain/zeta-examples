// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ZetaMPI.sol";

contract CrossChainWarriors is ERC721("CrossChainWarriors", "CCWAR"), Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    bytes32 public constant CROSS_CHAIN_TRANSFER_MESSAGE = keccak256("CROSS_CHAIN_TRANSFER");

    address internal _crossChainAddress;

    uint16 internal _crossChainID;

    address internal _zetaMpiAddress;
    ZetaMPI internal _zetaMpi;

    IERC20 internal _zetaToken;

    string public baseURI;

    Counters.Counter public tokenIds;

    constructor(
        address _zetaMpiInputAddress,
        address _zetaTokenAddress,
        bool useEven
    ) {
        _zetaMpiAddress = _zetaMpiInputAddress;
        _zetaMpi = ZetaMPI(_zetaMpiInputAddress);
        _zetaToken = IERC20(_zetaTokenAddress);

        /**
         * @dev A simple way to prevent collisions between cross-chain token ids
         * @custom:see mint
         */
        tokenIds.increment();
        if (useEven) tokenIds.increment();
    }

    function setCrossChainAddress(address _ccAddress) public onlyOwner {
        _crossChainAddress = _ccAddress;
    }

    function setCrossChainID(uint16 _ccId) public onlyOwner {
        _crossChainID = _ccId;
    }

    function setBaseURI(string memory _baseURIParam) public onlyOwner {
        baseURI = _baseURIParam;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function mint(address to) public onlyOwner returns (uint256) {
        uint256 newWarriorId = tokenIds.current();
        _safeMint(to, newWarriorId);

        /**
         * @dev Always increment by two to keep ids even/odd (depending on the chain)
         * @custom:see constructor
         */
        tokenIds.increment();
        tokenIds.increment();

        return newWarriorId;
    }

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

        _zetaMpi.zetaMessageSend(
            _crossChainID,
            abi.encode(_crossChainAddress),
            0, // @todo (lucas): check if this is ok
            2500000, // @todo (lucas): check if this is ok
            abi.encode(CROSS_CHAIN_TRANSFER_MESSAGE, tokenId, to),
            abi.encode("") // @todo (lucas): check if this is ok
        );
    }

    function uponZetaMessage(
        bytes calldata sender,
        uint16 srcChainID,
        address destContract,
        uint256 zetaAmount,
        bytes calldata message
    ) external {
        require(msg.sender == _zetaMpiAddress, "This function can only be called by the Zeta MPI contract");
        require(abi.decode(sender, (address)) == _crossChainAddress, "Cross-chain address doesn't match");
        require(srcChainID == _crossChainID, "Cross-chain id doesn't match");

        (bytes32 messageType, uint256 tokenId, address to) = abi.decode(message, (bytes32, uint256, address));

        require(messageType == CROSS_CHAIN_TRANSFER_MESSAGE, "Invalid message type");

        _mintId(to, tokenId);
    }

    function zetaMessageRevert(
        address sender,
        string calldata destChainID,
        string calldata destContract,
        uint256 zetaRefundAmount,
        uint256 gasLimit,
        bytes calldata message,
        bytes32 messageID
    ) external {
        require(msg.sender == _zetaMpiAddress, "This function can only be called by the Zeta MPI contract");
    }
}
