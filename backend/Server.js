import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { OP } from "./models/OP.js";
import router from './models/OP.js';
import userRoutes from './models/Users.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
// import router  from './models/Queries.js';
import { Server } from "socket.io";
import http from "http";
import bidRoutes from './Routes/bidRoutes.js';


const app = express();
app.use(cors());
app.use(express.json());
const completedAuctionsFile = "./completedAuctions.json";
const projectprofiles = "./project-profile";
const bidTimers = {}; // Track timers per auction






if(!fs.existsSync(completedAuctionsFile)){
    fs.writeFileSync(completedAuctionsFile,JSON.stringify([]))
}

const completedAuctions = JSON.parse(fs.readFileSync(completedAuctionsFile));
// Database connection
mongoose.connect('mongodb://localhost:27017/Servify', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Database is Connected Successfully!");
}).catch((err) => {
    console.error('Error While Connecting to Database:', err);
});

// Setting up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const profileStorage = multer.diskStorage({
    destination : function(req,res,cb){
        cb(null,"project-profile/");
    },
    filename: function(req,file,cb){
        cb(null,Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
const profileUpload = multer({storage:profileStorage});

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.post("/reset-bids", async (req, res) => {
    try {
        await OP.updateMany({}, { $set: { currentBid: "$budget" } }); // Reset currentBid to budget
        io.emit("bidsReset"); // Notify all clients that bids are reset
        res.status(200).json({ message: "Bids reset successfully!" });
    } catch (error) {
        console.error("Error resetting bids:", error);
        res.status(500).json({ message: "Failed to reset bids" });
    }
});

// Socket.io functionality for real-time updates
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Adjust based on frontend URL
        methods: ["GET", "POST"]
    }
});


io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    

    socket.on("placeBid", async ({ auctionId, bidAmount, userEmail }) => {
        try {
            const auction = await OP.findById(auctionId);
            if (!auction) {
                console.log("Auction not found");
                return;
            }
                console.log('Threshold : ',auction.budget / 10);
                
            if(bidAmount <= auction.budget / 10){
                console.log("Minimum Threshold Reached");
                return ;
            }

            if (bidAmount >= auction.lowestBid) {
                console.log("Bid too high, not updating");      
                return;
            }



            auction.lowestBid = bidAmount;
            auction.lastBidder = userEmail;
            await auction.save();

            io.emit("updateAuction", auction);

            if(bidTimers[auctionId]){
                clearTimeout(bidTimers[auctionId]);
            }

            bidTimers[auctionId] = setTimeout(async ()=>{
                const lastAuction = await OP.findById(auctionId);
                if (lastAuction) {
                    io.emit("noBids", { auctionId, lastBidder: auction.lastBidder });
                    fs.writeFileSync('Auction_Data.json',`lastbidder_${auctionId}`);
                    console.log('Bid Timeout');
                }
            },15000)
        } catch (error) {
            console.error("Error processing bid:", error);
        }
    });
    

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

app.use('/cb',router);

// File upload route
app.post('/upload', upload.single('screenshot'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'File is empty!', ok: false });
    }
    return res.status(200).json({ message: 'File is uploaded successfully!', ok: true, filePath: req.file.path });
});

app.post('/upload-projectimg', profileUpload.single('Profile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'File is empty!', ok: false });
    }
    return res.status(200).json({ message: 'File is uploaded successfully!', ok: true, filePath: req.file.path });
});
// Signup routes
app.use('/users', userRoutes);

// Query routes
app.use('/query', router);

// Start server with correct listener
server.listen(5000, () => console.log('Server is Running on port 5000'));
