const { parentPort, workerData } = require('worker_threads');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Import models
const Agent = require('../models/Agent');
const User = require('../models/User');
const Account = require('../models/Account');
const PolicyCategory = require('../models/PolicyCategory');
const PolicyCarrier = require('../models/PolicyCarrier');
const PolicyInfo = require('../models/PolicyInfo');

// Function to process XLSX/CSV data
const processFileData = async (data) => {
    try {
        for (let row of data) {
            // Assuming row contains all necessary data fields
            const agent = new Agent({ agentName: row['Agent Name'] });
            const user = new User({
                firstName: row['First Name'],
                dob: new Date(row['DOB']),
                address: row['Address'],
                phoneNumber: row['Phone Number'],
                state: row['State'],
                zipCode: row['Zip Code'],
                email: row['Email'],
                gender: row['Gender'],
                userType: row['User Type'],
            });
            const account = new Account({ accountName: row['Account Name'], userId: user._id });
            const policyCategory = new PolicyCategory({ categoryName: row['Policy Category'] });
            const policyCarrier = new PolicyCarrier({ companyName: row['Policy Carrier'] });
            const policyInfo = new PolicyInfo({
                policyNumber: row['Policy Number'],
                policyStartDate: new Date(row['Policy Start Date']),
                policyEndDate: new Date(row['Policy End Date']),
                policyCategory: policyCategory._id,
                policyCarrier: policyCarrier._id,
                user: user._id,
            });

            // Save all documents
            await agent.save();
            await user.save();
            await account.save();
            await policyCategory.save();
            await policyCarrier.save();
            await policyInfo.save();
        }
    } catch (error) {
        throw error;
    }
};

(async () => {
    try {
        const filePath = workerData.filePath;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        await processFileData(data);
        parentPort.postMessage('File processed successfully');
    } catch (error) {
        parentPort.postMessage(`Error processing file: ${error.message}`);
    }
})();
