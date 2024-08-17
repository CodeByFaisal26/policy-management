const Schedule = require('../models/Schedule');

// Schedule a message
exports.scheduleMessage = async (req, res) => {
    try {
        const { message, day, time } = req.body;

        // Combine the day and time to create a Date object
        const scheduledAt = new Date(`${day} ${time}`);

        // Save the scheduled message to the database
        const newSchedule = new Schedule({
            message,
            scheduledAt,
        });

        await newSchedule.save();

        res.status(201).json({ message: 'Message scheduled successfully', newSchedule });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
