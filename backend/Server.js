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
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const completedAuctionsFile = "./completedAuctions.json";
const projectprofiles = "./project-profile";
const bidTimers = {}; // Track timers per auction
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const profileDir = path.join(__dirname, 'backend', 'project-profile');
if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir, { recursive: true });
}

console.log("Static Path:", path.join(__dirname, 'project-profile'));

app.use('/project-profile', express.static(path.join(__dirname, 'project-profile')));
app.use('/carousal',express.static(path.join(__dirname,'Carousal')));                   

const imagePath = path.join(__dirname, 'project-profile');


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

const storage = multer.diskStorage({
    destination: './uploads/', 
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

const profileStorage = multer.diskStorage({
    destination : function(req,res,cb){
        cb(null,"project-profile/");
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
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

app.post("/image",async (req,res)=>{
    const {url} = req.body;
    try {
        const imageurl = imagePath+url;
        console.log('Requested Image : ',imageurl);
        return res.status(200).json({path:imageurl})
    } catch (error) {
        console.error(error);
        
    }
})
// Socket.io functionality for real-time updates
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Adjust based on frontend URL
        methods: ["GET", "POST"]
    }
});

app.get('/api/images', (req, res) => {
    console.log('Getting Images for Carousal');
    
    const carousalPath = path.join(__dirname, 'Carousal');
    try {
        fs.readdir(carousalPath, (err, files) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to read folder' });
            }
            const imageUrls = files.map(file => `${file}`);
            const path = imageUrls;
            console.log('Image URLs for Carousal : ',path);
            return res.json({images:path});
        });
    } catch (error) {
console.error(error);
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
