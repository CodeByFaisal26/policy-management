const Schedule = require('../models/Schedule');
const mongoose = require('mongoose');

// Function to process scheduled messages
const processScheduledMessages = async () => {
    const now = new Date();

    // Find messages that are scheduled for now or earlier
    const messages = await Schedule.find({ scheduledAt: { $lte: now } });

    messages.forEach(async (message) => {
        console.log(`Processing message: ${message.message}`);

        // Remove the message after processing
        await Schedule.findByIdAndDelete(message._id);
    });
};

// Function to start the worker
const startWorker = () => {
    setInterval(processScheduledMessages, 60000); // Check every minute
};

// Connect to MongoDB and start the worker
const connectAndStartWorker = async () => {
    try {
        await mongoose.connect('mongodb+srv://Faisalpinitod:faisal@cluster0.y2f7t.mongodb.net/policyDB?retryWrites=true&w=majority', {
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
