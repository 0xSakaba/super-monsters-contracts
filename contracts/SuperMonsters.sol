// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NuushiNFT
 * @dev An example of an open edition NFT contract for 2 weeks.
 */
contract SuperMonsters is ERC721Enumerable, Ownable {
    uint256 public constant MINT_PRICE = 0.0012 ether;
    uint256 public constant MAX_SUPPLY = 100_000;

    uint256 public immutable startTimestamp;
    uint256 public endTimestamp;

    string private _baseTokenURI;

    event Minted(address indexed to, uint256 quantity);

    constructor(
        string memory baseTokenURI
    ) ERC721("Super Monsters", "SMT") Ownable(msg.sender) {
        startTimestamp = 1744070400;
        endTimestamp = 1744243200;
        _baseTokenURI = baseTokenURI;
    }

    /**
     * @dev mint NFT
     * @param quantity The number of NFTs to mint
     */
    function mint(uint256 quantity) external payable {
        // check if start selling and not end
        require(block.timestamp >= startTimestamp, "Sale has not started");
        require(block.timestamp <= endTimestamp, "Sale has ended");

        require(totalSupply() + quantity <= MAX_SUPPLY, "Exceeds MAX_SUPPLY");

        require(msg.value >= MINT_PRICE * quantity, "Insufficient ETH sent");

        for (uint256 i = 0; i < quantity; i++) {
            // tokenId use totalSupply() add 1
            uint256 newTokenId = totalSupply() + 1;
            _safeMint(msg.sender, newTokenId);
        }

        emit Minted(msg.sender, quantity);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _baseTokenURI;
    }

    /**
     * @dev owner can set the base URI
     */
    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        _baseTokenURI = _newBaseURI;
    }

    /**
     * @dev withdraw the contract balance
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @dev owner can set the end timestamp
     */
    function setEndTimestamp(uint256 _setEndTimestamp) external onlyOwner {
        endTimestamp = _setEndTimestamp;
    }
}
