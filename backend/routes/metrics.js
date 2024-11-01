
const express = require('express');
const router = express.Router();

const metrics = [
  { time: '2023-10-01 10:00', metric: 'CPU Usage', value: 30 },
  { time: '2023-10-01 11:00', metric: 'CPU Usage', value: 45 },
  { time: '2023-10-01 12:00', metric: 'CPU Usage', value: 50 },
  { time: '2023-10-01 10:00', metric: 'Memory Usage', value: 60 },
  { time: '2023-10-01 11:00', metric: 'Memory Usage', value: 70 },
  { time: '2023-10-01 12:00', metric: 'Memory Usage', value: 65 },
  { time: '2023-10-01 10:00', metric: 'Disk Usage', value: 40 },
  { time: '2023-10-01 11:00', metric: 'Disk Usage', value: 50 },
  { time: '2023-10-01 12:00', metric: 'Disk Usage', value: 55 },
];

router.get('/', (req, res) => {
  res.json(metrics);
});

module.exports = router;
