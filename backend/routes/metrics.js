const express = require('express');
const os = require('os');
const router = express.Router();

router.get('/', (req, res) => {
    const freeMemory = os.freemem();
    const totalMemory = os.totalmem();
    const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;

    const cpus = os.cpus();
    const cpuUsage = cpus.reduce((acc, cpu) => {
        const total = Object.values(cpu.times).reduce((acc, time) => acc + time, 0);
        return acc + (1 - cpu.times.idle / total) * 100;
    }, 0) / cpus.length;

    // 获取当前时间戳
    const timestamp = new Date().toISOString();

    res.json({
        timestamp,                // 添加时间戳字段
        cpuUsage: cpuUsage.toFixed(2), // CPU 使用率，保留两位小数
        memoryUsage: memoryUsage.toFixed(2) // 内存使用率，保留两位小数
    });
});

module.exports = router;
