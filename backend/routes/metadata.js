const express = require('express');
const router = express.Router();

// Generate metadata for certificate NFT
router.post('/certificate', async (req, res) => {
  try {
    const {
      institutionName,
      courseName,
      studentName,
      studentAddress,
      dateIssued,
      description,
      certificateType,
      skills
    } = req.body;

    const metadata = {
      name: `${courseName} Certificate`,
      description: description || `Certificate of completion for ${courseName} issued by ${institutionName}`,
      image: `https://your-ipfs-gateway.com/certificate-template/${certificateType}.png`,
      attributes: [
        {
          trait_type: "Institution",
          value: institutionName
        },
        {
          trait_type: "Course",
          value: courseName
        },
        {
          trait_type: "Student",
          value: studentName
        },
        {
          trait_type: "Type",
          value: certificateType
        },
        {
          trait_type: "Issue Date",
          value: dateIssued,
          display_type: "date"
        },
        {
          trait_type: "Blockchain",
          value: "Base"
        }
      ],
      properties: {
        student_address: studentAddress,
        institution: institutionName,
        course: courseName,
        type: certificateType,
        skills: skills || [],
        soulbound: true,
        chain: "base"
      }
    };

    // In production, upload to IPFS/Pinata and return the URI
    res.json({
      metadata,
      // metadataURI: `ipfs://${ipfsHash}` // After IPFS upload
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate metadata for Proof of Work NFT
router.post('/proof-of-work', async (req, res) => {
  try {
    const {
      gigTitle,
      clientAddress,
      freelancerName,
      completionDate,
      amount,
      skills,
      description
    } = req.body;

    const metadata = {
      name: `Proof of Work: ${gigTitle}`,
      description: description || `Verified completion of "${gigTitle}" on SkillSync Pro`,
      image: `https://your-ipfs-gateway.com/pow-template/default.png`,
      attributes: [
        {
          trait_type: "Gig Title",
          value: gigTitle
        },
        {
          trait_type: "Client",
          value: clientAddress
        },
        {
          trait_type: "Amount Earned (USDC)",
          value: amount,
          display_type: "number"
        },
        {
          trait_type: "Completion Date",
          value: completionDate,
          display_type: "date"
        },
        {
          trait_type: "Platform",
          value: "SkillSync Pro"
        },
        {
          trait_type: "Blockchain",
          value: "Base"
        }
      ],
      properties: {
        gig_title: gigTitle,
        client: clientAddress,
        freelancer: freelancerName,
        amount_usdc: amount,
        completion_date: completionDate,
        skills: skills || [],
        verified: true,
        soulbound: true,
        chain: "base"
      }
    };

    res.json({
      metadata,
      // metadataURI: `ipfs://${ipfsHash}` // After IPFS upload
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
