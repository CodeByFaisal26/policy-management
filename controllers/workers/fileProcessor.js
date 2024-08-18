const { parentPort, workerData } = require('worker_threads');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();


const mongoUri = process.env.MONGO_URI;
// MongoDB connection setup
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

const Agent = mongoose.model('Agent', new mongoose.Schema({ name: String }));
const User = mongoose.model('User', new mongoose.Schema({
    firstName: String,
    dob: Date,
    address: String,
    phoneNumber: String,
    state: String,
    zipCode: String,
    email: String,
    gender: String,
    userType: String,
    city: String,
    primary: Boolean,
    applicantId: String,
    hasActiveClientPolicy: Boolean,
}));
const UserAccount = mongoose.model('UserAccount', new mongoose.Schema({
    accountName: String,
    accountType: String,
}));
const PolicyCategory = mongoose.model('PolicyCategory', new mongoose.Schema({ categoryName: String }));
const PolicyCarrier = mongoose.model('PolicyCarrier', new mongoose.Schema({ companyName: String }));
const PolicyInfo = mongoose.model('PolicyInfo', new mongoose.Schema({
    policyNumber: String,
    startDate: Date,
    endDate: Date,
    policyCategoryId: mongoose.Schema.Types.ObjectId,
    companyId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    policyMode: String,
    producer: String,
    premiumAmountWritten: Number,
    premiumAmount: Number,
    policyType: String,
    csr: String,
    agencyId: String,
}));

const processFile = async (filePath) => {
    const results = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                for (const row of results) {
                    const agent = await Agent.create({ name: row.agent });
                    const policyCategory = await PolicyCategory.create({ categoryName: row.category_name });
                    const policyCarrier = await PolicyCarrier.create({ companyName: row.company_name });
                    const user = await User.create({
                        firstName: row.firstname,
                        dob: new Date(row.dob),
                        address: row.address,
                        phoneNumber: row.phone,
                        state: row.state,
                        zipCode: row.zip,
                        email: row.email,
                        gender: row.gender,
                        userType: row.userType,
                        city: row.city,
                        primary: row.primary === 'true',
                        applicantId: row['Applicant ID'],
                        hasActiveClientPolicy: row.hasActiveClientPolicy === 'true',
                    });
                    await UserAccount.create({
                        accountName: row.account_name,
                        accountType: row.account_type,
                    });
                    await PolicyInfo.create({
                        policyNumber: row.policy_number,
                        startDate: new Date(row.policy_start_date),
                        endDate: new Date(row.policy_end_date),
                        policyCategoryId: policyCategory._id,
                        companyId: policyCarrier._id,
                        userId: user._id,
                        policyMode: row.policy_mode,
                        producer: row.producer,
                        premiumAmountWritten: row.premium_amount_written,
                        premiumAmount: row.premium_amount,
                        policyType: row.policy_type,
                        csr: row.csr,
                        agencyId: row.agency_id,
                    });
                }
                parentPort.postMessage('File processed successfully');
            } catch (err) {
                console.error('Error processing file:', err);
                parentPort.postMessage('Error processing file');
            } finally {
                mongoose.connection.close();
                process.exit(0);
            }
        });
};

processFile(workerData.filePath);
