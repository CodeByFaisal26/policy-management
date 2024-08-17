const path = require('path');
const fs = require('fs');
const { Worker } = require('worker_threads');
const multer = require('multer');
const xlsx = require('xlsx');

// Set up multer for file uploads
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 1000000 },
    fileFilter(req, file, cb) {
        const extname = path.extname(file.originalname).toLowerCase();
        if (extname !== '.xlsx' && extname !== '.csv') {
            return cb(new Error('Please upload an XLSX or CSV file'));
        }
        cb(null, true);
    },
});

// Function to parse and process the file using worker threads
const processFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./workers/fileProcessor.js', {
            workerData: { filePath }
        });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
};

// Upload controller
exports.uploadFile = async (req, res) => {
    try {
        const file = req.file;
        const filePath = path.join(__dirname, '..', file.path);

        // Process the file in a worker thread
        await processFile(filePath);

        // Clean up the uploaded file
        fs.unlinkSync(filePath);

        res.status(200).json({ message: 'File processed and data uploaded successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Middleware to handle file uploads
exports.uploadMiddleware = upload.single('file');
