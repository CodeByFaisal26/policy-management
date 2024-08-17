const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    scheduledAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
