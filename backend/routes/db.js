// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');


db.serialize(() => {
    //add endopoint
    db.run(`ALTER TABLE clusters ADD COLUMN endpoint TEXT`, (err) => {
        if (err) {
            if (err.message.includes("duplicate column name")) {
                console.log("Column 'endpoint' already exists in 'clusters' table.");
            } else {
                console.error("Error adding 'endpoint' column to 'clusters' table:", err.message);
            }
        } else {
            console.log("Column 'endpoint' added to 'clusters' table.");
        }
    });
    // 创建 clusters 表
    db.run(`CREATE TABLE IF NOT EXISTS clusters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        status TEXT,
        nodes INTEGER,
        label TEXT,
        endpoint TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS nodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cluster_id INTEGER,
        type TEXT,            
        status TEXT,          
        FOREIGN KEY(cluster_id) REFERENCES clusters(id)
     )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS namespaces (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cluster_id INTEGER,
        name TEXT,
        FOREIGN KEY(cluster_id) REFERENCES clusters(id)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS workloads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        namespace_id INTEGER,
        name TEXT, -- 工作负载名称
        type TEXT, -- 工作负载类型，如 deployment 或 statefulset
        FOREIGN KEY (namespace_id) REFERENCES namespaces(id)
    )`);
    //folders 表
    db.run(`CREATE TABLE IF NOT EXISTS folders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT，
        path TEXT
    )`);
    db.run(`ALTER TABLE folders ADD COLUMN path TEXT`, (err) => {
        if (err) {
            if (err.message.includes("duplicate column name")) {
                console.log("Column 'path' already exists in 'folders' table.");
            } else {
                console.error("Error adding 'path' column to 'folders' table:", err.message);
            }
        } else {
            console.log("Column 'path' added to 'folders' table.");
        }
    });
    //files表
    db.run(`CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        size TEXT,
        path TEXT,
        folder_id INTEGER,
        FOREIGN KEY (folder_id) REFERENCES folders(id)
    )`);
});

module.exports = db;
