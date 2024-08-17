const mongoose = require('mongoose');

const PolicyInfoSchema = new mongoose.Schema({
    policyNumber: {
        type: String,
        required: true,
    },
    policyStartDate: {
        type: Date,
        required: true,
    },
    policyEndDate: {
        type: Date,
        required: true,
    },
    policyCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PolicyCategory',
        required: true,
    },
    policyCarrier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PolicyCarrier',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

module.exports = mongoose.model('PolicyInfo', PolicyInfoSchema);
