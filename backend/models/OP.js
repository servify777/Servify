import mongoose from 'mongoose';
import express from 'express';
import { User } from './Users.js';
import fs from 'fs';
import { ok } from 'assert';

const router = express.Router();



const OPSchema = new mongoose.Schema({
    url: String,
    title: String,
    description: String,
    budget: Number,
    technical_aspects: Array,
    lowestBid: { type: Number, default: Infinity },
    bids: [
      {
        userEmail: String,
        amount: Number,
        timestamp: { type: Date, default: Date.now }
      }
    ]
});

const OP = mongoose.model('Servify',OPSchema,'OP');

const completedAuctionsFile = "./completedAuctions.json";
const bidTimers = {}; // Track timers per auction
if(!fs.existsSync(completedAuctionsFile)){
    fs.writeFileSync(completedAuctionsFile,JSON.stringify([]))
}

// routing to database fetch operation
router.get('/current-biddings', async (req,res)=>{
    try{
        
const completedAuctions = JSON.parse(fs.readFileSync(completedAuctionsFile));
        const response = await OP.find({_id:{$nin:completedAuctions}});
        console.log(response)
    res.json(response);
    }

    catch(err){
        console.error('Error While Fetching Current Biddings from Database : ',err);
    }
});

router.post('/search-data', async (req,res)=>{
    const {title} = req.body;

    const searchResults = await OP.find({ title: { $regex: title, $options: "i" } });
    if(searchResults.length === 0){
        return res.status(404).json({message:'No Items Found !..',ok:false});
    }

    console.log('Search Results : ',searchResults);
    return res.status(200).json(searchResults);
});

router.post('/add-project',async (req,res)=>{
   try {
    const {url,title,description,budget,technical_aspects} = req.body;
    console.log('Printing : ',url);
    
    const entry = new OP({
        url,
        title,
        description,
        budget,
        technical_aspects
    });

    await entry.save();

    return res.status(200).json({message:'Your is Now on Live',ok:true});
   } catch (error) {
    return res.status(513).json({message:'Error While Sasving Project To Database !...',ok:false});
   }
});

router.get('/completed-bid',async (req,res)=>{
    try{
        const completedAuctions = JSON.parse(fs.readFileSync(completedAuctionsFile));
        res.json(completedAuctions);
    }

    catch(e){
        console.error('Error While Fetching Completed Auctions : ',e);
        
    }
});

router.post('/save-auction',async (req,res)=>{
    try {
        const { auctionId } = req.body;
        if (!auctionId) {
            return res.status(400).json({ message: "Auction ID is required" });
        }

        let completedAuctions = [];
        
        // Read existing JSON file safely
        if (fs.existsSync(completedAuctionsFile)) {
            try {
                const fileData = fs.readFileSync(completedAuctionsFile, "utf-8").trim();
                if (fileData) {
                    completedAuctions = JSON.parse(fileData);
                }
            } catch (err) {
                console.error("Error parsing JSON file. Resetting file:", err);
                completedAuctions = []; // Reset if JSON is corrupted
            }
        }

        // Ensure unique auction ID
        if (!completedAuctions.includes(auctionId)) {
            completedAuctions.push(auctionId);
            fs.writeFileSync(completedAuctionsFile, JSON.stringify(completedAuctions, null, 2));
            console.log(`Auction ${auctionId} marked as completed.`);
        }

        res.json({ message: "Auction marked as completed successfully", auctionId });
    }

    catch(e){
        console.log(e);
    }
});

// routing for server bidding 
router.post('/place-bid', async (req, res) => {
    const { auctionId, bidAmount, userEmail } = req.body;

    try {
        const auction = await OP.findById(auctionId);
        if (!auction  || auction.isCompleted) return res.status(404).json({ message: 'Auction not found' });

        if (bidAmount <= auction.budget / 10) {
            console.log("Minimum bid threshold reached, bid rejected.");
            return;
        }
        // Add bid
        auction.bids.push({ userEmail, amount: bidAmount });
        auction.lowestBid = Math.min(auction.lowestBid, bidAmount);
        await auction.save();

        // setting up the timer 
        if (bidTimers[auctionId]) clearTimeout(bidTimers[auctionId]);

            console.log(`Starting 15-second timer for auction ${auctionId}`);
            bidTimers[auctionId] = setTimeout(async () => {
                const lastAuction = await OP.findById(auctionId);
                if (lastAuction && !lastAuction.isCompleted) {
                    lastAuction.isCompleted = true;
                    await lastAuction.save();

                    // Store completed auction ID in JSON file
                    const completedAuctions = JSON.parse(fs.readFileSync(completedAuctionsFile));
                    completedAuctions.push(auctionId);
                    fs.writeFileSync(completedAuctionsFile, JSON.stringify(completedAuctions));

                    io.emit("auctionCompleted", { auctionId });
                    console.log(`Auction ${auctionId} marked as completed.`);
                }
                delete bidTimers[auctionId]; // Remove timer after execution
            }, 15000);

        res.json({ message: "Bid placed successfully", auction });
    } catch (error) {
        console.error("Error placing bid:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.use('/auction-data',async (req,res)=>{
    const {email} = req.body;

    try{
        const response = await User.findOne({email});
        if(!response){
            console.error('User Does Not Exists !...');
            return res.status(509).json({message:'User Does Not Exists !...'});
        }
        const skills = response.skills;
        try{
            const dataFetch = await OP.find({
                technical_aspects: { $in: skills }
            });

            console.log('Data from OP : ',dataFetch);
            

            return res.status(200).json({message:'Data Fetch is Sucessfull',data:dataFetch,ok:true});
        }

        catch(e){
            console.error(e);
            
        }
    }

    catch(e){
        console.error(e);
        
    }

})
export default router;
export { OP };