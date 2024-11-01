// folders.js
const express = require('express');
const router = express.Router();
const db = require('./db');

// 查询所有文件夹
router.get('/', (req, res) => {
    db.all('SELECT * FROM folders', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// 查询特定文件夹下的文件
router.get('/:id/files', (req, res) => {
    const { id } = req.params;
    db.all('SELECT * FROM files WHERE folder_id = ?', [id], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});
router.post('/', (req, res) => {
    const { name, path } = req.body;
    db.run(
        `INSERT INTO folders (name, path) VALUES (?, ?)`,
        [name, path],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
});

module.exports = router;
