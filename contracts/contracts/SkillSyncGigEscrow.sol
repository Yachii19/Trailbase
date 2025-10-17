// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SkillSyncGigEscrow
 * @dev Handles gig escrow with USDC and mints Proof-of-Work NFTs
 */
contract SkillSyncGigEscrow is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _gigIds;
    uint256 private _proofIds;

    IERC20 public usdcToken;
    uint256 public platformFeePercent = 2; // 2% platform fee
    address public platformWallet;

    enum GigStatus { Open, Accepted, Completed, Disputed, Cancelled }

    struct Gig {
        uint256 gigId;
        address client;
        address freelancer;
        string title;
        string description;
        uint256 amount; // In USDC (6 decimals)
        uint256 deadline;
        GigStatus status;
        uint256 createdAt;
        uint256 completedAt;
    }

    mapping(uint256 => Gig) public gigs;
    mapping(address => uint256[]) public clientGigs;
    mapping(address => uint256[]) public freelancerGigs;
    mapping(uint256 => uint256) public gigToProofToken; // gigId => proofTokenId

    event GigPosted(
        uint256 indexed gigId,
        address indexed client,
        string title,
        uint256 amount,
        uint256 deadline
    );
    event GigAccepted(uint256 indexed gigId, address indexed freelancer);
    event GigCompleted(
        uint256 indexed gigId,
        address indexed freelancer,
        uint256 proofTokenId
    );
    event GigCancelled(uint256 indexed gigId);
    event ProofOfWorkMinted(
        uint256 indexed proofId,
        address indexed freelancer,
        uint256 indexed gigId
    );

    constructor(address _usdcToken, address _platformWallet) 
        ERC721("SkillSync Proof of Work", "SSPOW") 
        Ownable(msg.sender) 
    {
        require(_usdcToken != address(0), "Invalid USDC address");
        require(_platformWallet != address(0), "Invalid platform wallet");
        usdcToken = IERC20(_usdcToken);
        platformWallet = _platformWallet;
    }

    /**
     * @dev Post a new gig with USDC escrow
     */
    function postGig(
        string memory title,
        string memory description,
        uint256 amount,
        uint256 deadline
    ) external nonReentrant returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(deadline > block.timestamp, "Deadline must be in future");
        require(bytes(title).length > 0, "Title required");

        // Transfer USDC to contract (escrow)
        require(
            usdcToken.transferFrom(msg.sender, address(this), amount),
            "USDC transfer failed"
        );

        _gigIds++;
        uint256 newGigId = _gigIds;

        gigs[newGigId] = Gig({
            gigId: newGigId,
            client: msg.sender,
            freelancer: address(0),
            title: title,
            description: description,
            amount: amount,
            deadline: deadline,
            status: GigStatus.Open,
            createdAt: block.timestamp,
            completedAt: 0
        });

        clientGigs[msg.sender].push(newGigId);

        emit GigPosted(newGigId, msg.sender, title, amount, deadline);
        return newGigId;
    }

    /**
     * @dev Freelancer accepts a gig
     */
    function acceptGig(uint256 gigId) external {
        Gig storage gig = gigs[gigId];
        require(gig.status == GigStatus.Open, "Gig not available");
        require(gig.client != msg.sender, "Client cannot accept own gig");
        require(block.timestamp < gig.deadline, "Gig deadline passed");

        gig.freelancer = msg.sender;
        gig.status = GigStatus.Accepted;
        freelancerGigs[msg.sender].push(gigId);

        emit GigAccepted(gigId, msg.sender);
    }

    /**
     * @dev Client releases payment and mints Proof-of-Work NFT
     */
    function releasePayment(uint256 gigId, string memory metadataURI) 
        external 
        nonReentrant 
    {
        Gig storage gig = gigs[gigId];
        require(gig.client == msg.sender, "Only client can release payment");
        require(gig.status == GigStatus.Accepted, "Gig not in accepted state");
        require(gig.freelancer != address(0), "No freelancer assigned");

        // Calculate platform fee
        uint256 platformFee = (gig.amount * platformFeePercent) / 100;
        uint256 freelancerPayment = gig.amount - platformFee;

        // Transfer USDC
        require(
            usdcToken.transfer(gig.freelancer, freelancerPayment),
            "Freelancer payment failed"
        );
        require(
            usdcToken.transfer(platformWallet, platformFee),
            "Platform fee transfer failed"
        );

        // Mint Proof-of-Work NFT
        _proofIds++;
        uint256 newProofId = _proofIds;

        _safeMint(gig.freelancer, newProofId);
        _setTokenURI(newProofId, metadataURI);

        gigToProofToken[gigId] = newProofId;

        // Update gig status
        gig.status = GigStatus.Completed;
        gig.completedAt = block.timestamp;

        emit GigCompleted(gigId, gig.freelancer, newProofId);
        emit ProofOfWorkMinted(newProofId, gig.freelancer, gigId);
    }

    /**
     * @dev Cancel gig and refund client (only if not accepted)
     */
    function cancelGig(uint256 gigId) external nonReentrant {
        Gig storage gig = gigs[gigId];
        require(gig.client == msg.sender, "Only client can cancel");
        require(gig.status == GigStatus.Open, "Cannot cancel accepted gig");

        gig.status = GigStatus.Cancelled;

        // Refund USDC to client
        require(
            usdcToken.transfer(gig.client, gig.amount),
            "Refund failed"
        );

        emit GigCancelled(gigId);
    }

    /**
     * @dev Get gig details
     */
    function getGig(uint256 gigId) external view returns (Gig memory) {
        require(gigs[gigId].gigId != 0, "Gig does not exist");
        return gigs[gigId];
    }

    /**
     * @dev Get client's gigs
     */
    function getClientGigs(address client) external view returns (uint256[] memory) {
        return clientGigs[client];
    }

    /**
     * @dev Get freelancer's gigs
     */
    function getFreelancerGigs(address freelancer) external view returns (uint256[] memory) {
        return freelancerGigs[freelancer];
    }

    /**
     * @dev Update platform fee (only owner)
     */
    function setPlatformFee(uint256 newFeePercent) external onlyOwner {
        require(newFeePercent <= 10, "Fee too high"); // Max 10%
        platformFeePercent = newFeePercent;
    }

    /**
     * @dev Override to make Proof-of-Work NFTs non-transferable
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("Proof of Work is non-transferable");
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
