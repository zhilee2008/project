
import React, { useEffect, useState } from 'react';
import { Card, List, Spin } from 'antd';

const FileDisplay = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/files');
                const data = await response.json();
                setFiles(data);
            } catch (error) {
                console.error('Error fetching files:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);

    return (
        <Card title="File Display" bordered={false}>
            {loading ? (
                <Spin />
            ) : (
                <List
                    dataSource={files}
                    renderItem={item => (
                        <List.Item>
                            {item.name} - {item.size}
                        </List.Item>
                    )}
                />
            )}
        </Card>
    );
};

export default FileDisplay;
