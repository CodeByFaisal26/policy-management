const Schedule = require('../models/Schedule');
const mongoose = require('mongoose');
require('dotenv').config();


const mongoUri = process.env.MONGO_URI;

const processScheduledMessages = async () => {
    const now = new Date();


    const messages = await Schedule.find({ scheduledAt: { $lte: now } });

    messages.forEach(async (message) => {
        console.log(`Processing message: ${message.message}`);

        
        await Schedule.findByIdAndDelete(message._id);
    });
};


const startWorker = () => {
    setInterval(processScheduledMessages, 60000); 
};


const connectAndStartWorker = async () => {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
        startWorker();
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
};

connectAndStartWorker();
