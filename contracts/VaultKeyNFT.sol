
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract VaultKeyNFT is ERC721, ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;
    uint256 public mintPrice = 0.001 ether;
    uint256 public maxTokens = 1000;
    string public baseURI;
    
    constructor(address initialOwner, string memory _initialBaseURI) 
        ERC721("VaultKey", "VKEY") 
        Ownable(initialOwner)
    {
        baseURI = _initialBaseURI;
    }
    
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
    
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) revert ERC721NonexistentToken(tokenId);
        
        return bytes(baseURI).length > 0 ? 
            string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : 
            "";
    }

    function mint() public payable {
        require(_nextTokenId < maxTokens, "Max tokens minted");
        require(msg.value >= mintPrice, "Insufficient payment");
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(_msgSender(), tokenId);
    }
    
    function hasAccess(address user) public view returns (bool) {
        return balanceOf(user) > 0;
    }
    
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }
    
    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }
    
    function setMaxTokens(uint256 _maxTokens) public onlyOwner {
        maxTokens = _maxTokens;
    }

    // Required overrides
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
