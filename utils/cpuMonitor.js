const os = require('os-utils');
const { exec } = require('child_process');

const monitorCPU = () => {
    os.cpuUsage((cpuPercent) => {
        console.log(`CPU Usage: ${(cpuPercent * 100).toFixed(2)}%`);
        if (cpuPercent > 0.7) {
            console.log('CPU usage exceeds 70%, restarting server...');
            restartServer();
        }
    });
};

const restartServer = () => {
    exec('pm2 restart all', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error restarting server: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
};


setInterval(monitorCPU, 10000);
