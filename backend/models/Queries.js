import mongoose from "mongoose";
import express from "express";

const router = express.Router();

const querySchema = mongoose.Schema({
    email: { type: String, required: true },
    issue: { type: String, required: true },
    description: { type: String, required: true },
    screenshot: { type: String, required: false }
});

const Queries = mongoose.model('Queries', querySchema);

router.post('/raise-query', async (req, res) => {
    console.log('executing !....');
    
    const { email, issue, description, screenshot } = req.body;
    console.log('Email is : ',email);
    

    try {
        const query = new Queries({ email, issue, description, screenshot });
        await query.save();

        return res.status(200).json({ message: 'Query Raised Successfully!.' });

    } catch (e) {
        console.error('Error While Trying to Connect to Query Database!', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

export { Queries, router };
