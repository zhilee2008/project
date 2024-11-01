// files.js
const express = require('express');
const router = express.Router();
const db = require('./db');

/**
 * @swagger
 * /files:
 *   get:
 *     summary: 获取所有文件
 *     tags: [Files]
 *     responses:
 *       200:
 *         description: 返回所有文件
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', (req, res) => {
    db.all('SELECT * FROM files', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// 查询特定文件夹下的文件
router.get('/folder/:folderId', (req, res) => {
    const folderId = parseInt(req.params.folderId, 10); // 转为整数类型
    if (isNaN(folderId)) {
        return res.status(400).json({ error: 'Invalid folder ID' });
    }
    
    const query = 'SELECT * FROM files WHERE folder_id = ?';

    db.all(query, [folderId], (err, rows) => {
        if (err) {
            console.error('Error fetching files:', err);
            res.status(500).json({ error: 'Failed to fetch files' });
        } else {
            res.json(rows);
        }
    });
});

// 删除文件
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM files WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'File deleted successfully' });
    });
});

router.post('/', (req, res) => {
    const { name, size,folder_id } = req.body;
    db.run(
        `INSERT INTO files (name, size,folder_id) VALUES (?, ?,?)`,
        [name, size,folder_id],
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
