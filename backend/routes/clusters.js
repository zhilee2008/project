// clusters.js
const express = require('express');
const router = express.Router();
const db = require('./db');

/**
 * @swagger
 * /clusters:
 *   get:
 *     summary: 获取所有cluster
 *     tags: [Clusters]
 *     responses:
 *       200:
 *         description: 返回所有cluster
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', (req, res) => {
    db.all('SELECT * FROM clusters', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// 获取单个 cluster
router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM clusters WHERE id = ?', [id], (err, cluster) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!cluster) {
            res.status(404).json({ error: 'Cluster not found' });
            return;
        }

        // 获取节点信息
        db.all('SELECT * FROM nodes WHERE cluster_id = ?', [id], (err, nodes) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            // 获取命名空间信息
            db.all('SELECT * FROM namespaces WHERE cluster_id = ?', [id], async (err, namespaces) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }

                // 获取每个命名空间的 workloads 数据
                const namespacesWithWorkloads = await Promise.all(
                    namespaces.map(namespace => new Promise((resolve, reject) => {
                        db.all('SELECT * FROM workloads WHERE namespace_id = ?', [namespace.id], (err, workloads) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({ ...namespace, workloads });
                            }
                        });
                    }))
                ).catch(error => {
                    res.status(500).json({ error: error.message });
                    return;
                });

                // 返回完整数据
                res.json({ ...cluster, nodes, namespaces: namespacesWithWorkloads });
            });
        });
    });
});


/**
 * @swagger
 * /clusters:
 *   post:
 *     summary: 创建一个新集群
 *     tags: [Clusters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *               nodes:
 *                 type: integer
 *               label:
 *                 type: string
 *     responses:
 *       201:
 *         description: 集群创建成功
 */
router.post('/', (req, res) => {
    const { name, label, endpoint } = req.body;

    db.run(
        `INSERT INTO clusters (name, status, nodes, label, endpoint) VALUES (?, ?, ?, ?, ?)`,
        [name, "active", 3, label, endpoint],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            const clusterId = this.lastID;

            // 随机生成 3 个节点信息
            const nodes = [
                { type: 'master', status: 'on'},
                { type: 'worker1', status: 'on' },
                { type: 'worker2', status: 'off' }
            ];

            nodes.forEach(node => {
                db.run(
                    `INSERT INTO nodes (cluster_id, type, status) VALUES (?, ?, ?)`,
                    [clusterId, node.type, node.status],
                    (err) => {
                        if (err) {
                            console.error('Error inserting node:', err.message);
                        }
                    }
                );
            });

            // 随机生成 namespace 信息
            const namespaces = ['default', `namespace_${Math.floor(Math.random() * 100)}`];

            namespaces.forEach(namespace => {
                db.run(
                    `INSERT INTO namespaces (cluster_id, name) VALUES (?, ?)`,
                    [clusterId, namespace],
                    function (err) {
                        if (err) {
                            console.error('Error inserting namespace:', err.message);
                            return;
                        }

                        const namespaceId = this.lastID;

                        // 为每个 namespace 随机生成 workload 信息
                        const workloads = [
                            { name: `workload_${Math.floor(Math.random() * 100)}`, type: 'deployment' },
                            { name: `workload_${Math.floor(Math.random() * 100)}`, type: 'pod' }
                        ];

                        workloads.forEach(workload => {
                            db.run(
                                `INSERT INTO workloads (namespace_id, name, type) VALUES (?, ?, ?)`,
                                [namespaceId, workload.name, workload.type],
                                (err) => {
                                    if (err) {
                                        console.error('Error inserting workload:', err.message);
                                    }
                                }
                            );
                        });
                    }
                );
            });

            res.json({ id: clusterId });
        }
    );
});

// 更新 cluster
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { label } = req.body;
    db.run(
        `UPDATE clusters SET  label = ? WHERE id = ?`,
        [label, id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Cluster updated successfully' });
        }
    );
});

// 删除 cluster
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM clusters WHERE id = ?`, [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Cluster deleted successfully' });
    });
});

module.exports = router;
