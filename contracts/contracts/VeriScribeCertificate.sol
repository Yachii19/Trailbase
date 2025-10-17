// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VeriScribeCertificate
 * @dev Non-transferable (Soulbound) NFT Certificate for academic achievements
 */
contract VeriScribeCertificate is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    // Mapping from institution address to verification status
    mapping(address => bool) public verifiedInstitutions;
    
    // Mapping from tokenId to certificate metadata
    mapping(uint256 => CertificateData) public certificates;
    
    struct CertificateData {
        address student;
        address institution;
        string institutionName;
        string courseName;
        string certificateType;
        uint256 issuedDate;
        bool isValid;
    }
    
    event InstitutionVerified(address indexed institution);
    event InstitutionRevoked(address indexed institution);
    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed student,
        address indexed institution,
        string courseName
    );
    event CertificateRevoked(uint256 indexed tokenId);

    constructor() ERC721("VeriScribe Certificate", "VSCERT") Ownable(msg.sender) {}

    /**
     * @dev Add a verified institution (only owner/admin)
     */
    function addVerifiedInstitution(address institution) external onlyOwner {
        require(institution != address(0), "Invalid address");
        verifiedInstitutions[institution] = true;
        emit InstitutionVerified(institution);
    }

    /**
     * @dev Revoke institution verification
     */
    function revokeInstitution(address institution) external onlyOwner {
        verifiedInstitutions[institution] = false;
        emit InstitutionRevoked(institution);
    }

    /**
     * @dev Mint a new certificate NFT
     */
    function mintCertificate(
        address student,
        string memory institutionName,
        string memory courseName,
        string memory certificateType,
        string memory metadataURI
    ) external returns (uint256) {
        require(verifiedInstitutions[msg.sender], "Not a verified institution");
        require(student != address(0), "Invalid student address");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(student, newTokenId);
        _setTokenURI(newTokenId, metadataURI);

        certificates[newTokenId] = CertificateData({
            student: student,
            institution: msg.sender,
            institutionName: institutionName,
            courseName: courseName,
            certificateType: certificateType,
            issuedDate: block.timestamp,
            isValid: true
        });

        emit CertificateIssued(newTokenId, student, msg.sender, courseName);
        return newTokenId;
    }

    /**
     * @dev Revoke a certificate
     */
    function revokeCertificate(uint256 tokenId) external {
        require(certificates[tokenId].institution == msg.sender, "Not the issuer");
        certificates[tokenId].isValid = false;
        emit CertificateRevoked(tokenId);
    }

    /**
     * @dev Get certificate details
     */
    function getCertificate(uint256 tokenId) external view returns (CertificateData memory) {
        require(_ownerOf(tokenId) != address(0), "Certificate does not exist");
        return certificates[tokenId];
    }

    /**
     * @dev Override transfer functions to make NFTs non-transferable (Soulbound)
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("Certificate is non-transferable");
        }
        return super._update(to, tokenId, auth);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
