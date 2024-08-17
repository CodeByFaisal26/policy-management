const User = require('../models/User');
const PolicyInfo = require('../models/PolicyInfo');

// Search for policy information by username
exports.searchPolicyByUsername = async (req, res) => {
    try {
        const { username } = req.query;

        // Find the user by username
        const user = await User.findOne({ firstName: username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find policies associated with the user
        const policies = await PolicyInfo.find({ user: user._id })
            .populate('policyCategory')
            .populate('policyCarrier');

        res.status(200).json({ policies });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





// Aggregate policies by each user
exports.aggregatePoliciesByUser = async (req, res) => {
    try {
        const aggregateData = await PolicyInfo.aggregate([
            {
                $group: {
                    _id: "$user",
                    totalPolicies: { $sum: 1 },
                    policies: { $push: "$$ROOT" },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $unwind: "$userDetails",
            },
            {
                $project: {
                    _id: 0,
                    user: "$userDetails.firstName",
                    totalPolicies: 1,
                    policies: 1,
                },
            },
        ]);

        res.status(200).json({ aggregateData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
