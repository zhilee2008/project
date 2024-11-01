// src/components/FolderDisplay.js
import React, { useEffect, useState } from 'react';
import { Card, Collapse, List, Spin, Button, Modal, Form, Input, Empty } from 'antd';

const { Panel } = Collapse;

const FolderDisplay = ({ apiBaseUrl }) => {
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFolder, setActiveFolder] = useState(null);
    const [isAddFileModalVisible, setIsAddFileModalVisible] = useState(false);
    const [isAddFolderModalVisible, setIsAddFolderModalVisible] = useState(false);
    const [currentFolder, setCurrentFolder] = useState(null);

    useEffect(() => {
        fetchFolders();
    }, []);

    const fetchFolders = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/folders`);
            const data = await response.json();

            // 更新文件夹列表
            setFolders(data);

            // 逐个文件夹获取文件数据
            data.forEach((folder) => {
                fetchFilesForFolder(folder.id);
            });
        } catch (error) {
            console.error('Error fetching folders:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilesForFolder = async (folderId) => {
        try {
            const response = await fetch(`${apiBaseUrl}/files/folder/${folderId}`);
            const files = await response.json();
            setFolders(prevFolders =>
                prevFolders.map(folder =>
                    folder.id === folderId ? { ...folder, files } : folder
                )
            );
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const handleFolderClick = (folderId) => {
        setActiveFolder(activeFolder === folderId ? null : folderId);
        if (activeFolder !== folderId) {
            setTimeout(() => {
                fetchFilesForFolder(folderId);
            }, 0); // Ensure `activeFolder` is set before fetching files
        }
    };

    const showAddFileModal = (folder) => {
        setCurrentFolder(folder);
        setIsAddFileModalVisible(true);
    };

    const showAddFolderModal = () => {
        setIsAddFolderModalVisible(true);
    };

    const handleAddFile = async (values) => {
        await fetch(`${apiBaseUrl}/files`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...values, folder_id: currentFolder.id }),
        });
        setIsAddFileModalVisible(false);
        fetchFilesForFolder(currentFolder.id); // Refresh files after adding a new one
    };

    const handleAddFolder = async (values) => {
        await fetch(`${apiBaseUrl}/folders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        setIsAddFolderModalVisible(false);
        fetchFolders(); // Refresh folders list after adding a new folder
    };

    const handleDeleteFolder = async (folderId) => {
        await fetch(`${apiBaseUrl}/folders/${folderId}`, {
            method: 'DELETE',
        });
        fetchFolders(); // Refresh folders list after deletion
    };

    const handleDeleteFile = async (fileId, folderId) => {
        await fetch(`${apiBaseUrl}/files/${fileId}`, {
            method: 'DELETE',
        });
        fetchFilesForFolder(folderId); // Refresh file list for the specific folder after deletion
    };

    return (
        <Card title="Folder Display" bordered={false} extra={
            <Button type="primary" style={{ marginBottom: 16 }} onClick={showAddFolderModal}>
                Add Folder
            </Button>}>
            
            {loading ? (
                <Spin />
            ) : (
                <Collapse accordion activeKey={activeFolder} onChange={handleFolderClick}>
                    {folders.map(folder => (
                        <Panel
                            header={folder.name}
                            key={folder.id}
                            extra={
                                <>
                                    <Button type="link" onClick={() => showAddFileModal(folder)}>Add Files</Button>
                                    <Button type="link" onClick={() => handleDeleteFolder(folder.id)}>Delete</Button>
                                </>
                            }
                        >
                            {folder.files && folder.files.length > 0 ? (
                                <List
                                    dataSource={folder.files}
                                    renderItem={file => (
                                        <List.Item
                                            actions={[
                                                <Button
                                                    type="link"
                                                    onClick={() => handleDeleteFile(file.id, folder.id)}
                                                >
                                                    Delete
                                                </Button>
                                            ]}
                                        >
                                            {file.name} - {file.size}
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <Empty description="No files in this folder" />
                            )}
                        </Panel>
                    ))}
                </Collapse>
            )}

            {/* Add File Modal */}
            <Modal
                title="Add File"
                visible={isAddFileModalVisible}
                onCancel={() => setIsAddFileModalVisible(false)}
                footer={null}
            >
                <Form onFinish={handleAddFile}>
                    <Form.Item name="name" label="File Name" rules={[{ required: true, message: 'Please enter the file name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="size" label="File Path" rules={[{ required: true, message: 'Please enter the file path!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add File
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Add Folder Modal */}
            <Modal
                title="Add Folder"
                visible={isAddFolderModalVisible}
                onCancel={() => setIsAddFolderModalVisible(false)}
                footer={null}
            >
                <Form onFinish={handleAddFolder}>
                    <Form.Item name="name" label="Folder Name" rules={[{ required: true, message: 'Please enter the folder name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="path" label="Folder Path" rules={[{ required: true, message: 'Please enter the folder path!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Folder
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default FolderDisplay;
