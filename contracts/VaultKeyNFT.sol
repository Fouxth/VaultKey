// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// นำเข้า smart contracts จาก OpenZeppelin
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// สร้าง contract VaultKeyNFT ที่สืบทอดจาก ERC721, ERC721Enumerable และ Ownable
contract VaultKeyNFT is ERC721, ERC721Enumerable, Ownable {
    using Strings for uint256;  // ใช้ library Strings สำหรับแปลง uint256 เป็น string

    // ตัวแปรสำหรับเก็บข้อมูล
    uint256 private _nextTokenId;            // ID ของ token ถัดไปที่จะ mint
    uint256 public mintPrice = 0.001 ether;  // ราคาในการ mint (0.001 ETH)
    uint256 public maxTokens = 1000;         // จำนวน token สูงสุดที่สามารถ mint ได้
    string public baseURI;                   // URI พื้นฐานสำหรับ metadata ของ NFT
    
    // Constructor รับ address ของเจ้าของและ baseURI เริ่มต้น
    constructor(address initialOwner, string memory _initialBaseURI) 
        ERC721("VaultKey", "VKEY")          // ตั้งชื่อ NFT และ symbol
        Ownable(initialOwner)               // กำหนดเจ้าของเริ่มต้น
    {
        baseURI = _initialBaseURI;          // กำหนด baseURI เริ่มต้น
    }
    
    // ฟังก์ชันสำหรับดึง baseURI (override จาก ERC721)
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
    
    // ฟังก์ชันสำหรับเปลี่ยน baseURI (เฉพาะเจ้าของ)
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }
    
    // ฟังก์ชันสำหรับดึง URI ของ token แต่ละตัว
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) revert ERC721NonexistentToken(tokenId);
        
        // ถ้ามี baseURI ให้ต่อด้วย tokenId และ .json
        return bytes(baseURI).length > 0 ? 
            string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : 
            "";
    }

    // ฟังก์ชันสำหรับ mint NFT
    function mint() public payable {
        require(_nextTokenId < maxTokens, "Max tokens minted");     // เช็คว่ายังไม่เกินจำนวนสูงสุด
        require(msg.value >= mintPrice, "Insufficient payment");    // เช็คว่าส่ง ETH มาพอ
        
        uint256 tokenId = _nextTokenId++;    // กำหนด tokenId และเพิ่มค่าสำหรับ token ถัดไป
        _safeMint(_msgSender(), tokenId);    // mint NFT ให้ผู้เรียกฟังก์ชัน
    }
    
    // ฟังก์ชันตรวจสอบว่า address มีสิทธิ์เข้าถึง vault หรือไม่
    function hasAccess(address user) public view returns (bool) {
        return balanceOf(user) > 0;  // มีสิทธิ์ถ้ามี NFT อย่างน้อย 1 ตัว
    }
    
    // ฟังก์ชันถอน ETH ที่ได้จากการ mint (เฉพาะเจ้าของ)
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;  // ดึงยอด ETH ทั้งหมดใน contract
        payable(owner()).transfer(balance);       // โอนไปยังเจ้าของ contract
    }
    
    // ฟังก์ชันตั้งราคา mint (เฉพาะเจ้าของ)
    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }
    
    // ฟังก์ชันตั้งจำนวน token สูงสุด (เฉพาะเจ้าของ)
    function setMaxTokens(uint256 _maxTokens) public onlyOwner {
        maxTokens = _maxTokens;
    }

    // Override functions ที่จำเป็นสำหรับ ERC721Enumerable
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
    
    // ฟังก์ชันตรวจสอบว่า token ID นี้มีอยู่จริงหรือไม่
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);  // ถ้าไม่มีเจ้าของ (address(0)) แสดงว่าไม่มี token นี้
    }
}