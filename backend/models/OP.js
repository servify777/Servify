import mongoose from 'mongoose';
import express from 'express';
import { User } from './Users.js';

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

// routing to database fetch operation
router.get('/current-biddings', async (req,res)=>{
    try{
        const response = await OP.find();
        console.log(response)
    res.json(response);
    }

    catch(err){
        console.error('Error While Fetching Current Biddings from Database : ',err);
    }
});

// routing for server bidding 
router.post('/place-bid', async (req, res) => {
    const { auctionId, bidAmount, userEmail } = req.body;

    try {
        const auction = await OP.findById(auctionId);
        if (!auction) return res.status(404).json({ message: 'Auction not found' });

        // Add bid
        auction.bids.push({ userEmail, amount: bidAmount });
        auction.lowestBid = Math.min(auction.lowestBid, bidAmount);
        await auction.save();

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