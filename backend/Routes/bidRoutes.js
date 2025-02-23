import express from "express";
import {OP} from "../models/OP.js";
import {FB} from '../models/FB.js';

const router = express.Router();

router.post("/placeBid", async (req, res) => {
    const { auctionId, bidAmount } = req.body;

    try {
        const auction = await OP.findById(auctionId);
        if (!auction) return res.status(404).json({ error: "Auction not found" });

        if (bidAmount >= auction.lowestBid) {
            return res.status(400).json({ error: "Your bid must be lower than the current lowest bid" });
        }

        auction.lowestBid = bidAmount;
        await auction.save();

        res.json({ message: "Bid placed successfully", auction });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/finalize-bid/:projectId", async (req, res) => {
    try {
      const { projectId } = req.params;

      console.log('Finalising Data : ',projectId);
  
      // Find the project
      const project = await OP.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      if (!project.lowestBidder) {
        return res.status(400).json({ message: "No bids placed" });
      }
  
      // Create a new finalized bid entry
      const finalizedBid = new FB({
        projectId: project._id,
        projectName: project.name,
        budget: project.budget,
        winner: project.lowestBidder, // Assuming you store this in OP
        finalBidAmount: project.lowestBid,
      });
  
      // Save the finalized bid
      await FB.save();
  
      // Delete the project from OP
      await OP.findByIdAndDelete(projectId);
  
      return res.status(200).json({ message: "Bid finalized and moved", finalizedBid });
    } catch (error) {
      console.error("Error finalizing bid:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

export default router;
