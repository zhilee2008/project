// src/components/ClusterInfo.js
import React, { useEffect, useState } from 'react';
import { Card, List, Spin, Button, Modal, Form, Input } from 'antd';

const ClusterInfo = ({ onDetails }) => {
    const [clusters, setClusters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentCluster, setCurrentCluster] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchClusters = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/clusters');
                const data = await response.json();
                setClusters(data);
            } catch (error) {
                console.error('Error fetching clusters:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClusters();
    }, []);

    const showModal = (cluster) => {
        setCurrentCluster(cluster);
        form.resetFields();
        if (cluster) {
            form.setFieldsValue({ label: cluster.label, name: cluster.name, endpoint: cluster.endpoint });
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (currentCluster) {
                await fetch(`http://localhost:5000/api/clusters/${currentCluster.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ label: values.label }),
                });
            } else {
                await fetch('http://localhost:5000/api/clusters', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: values.name,
                        label: values.label,
                        endpoint: values.endpoint,
                    }),
                });
            }

            const response = await fetch('http://localhost:5000/api/clusters');
            const data = await response.json();
            setClusters(data);
            setIsModalVisible(false);
            form.resetFields();
            setCurrentCluster(null);
        } catch (error) {
            console.error('Error saving cluster:', error);
        }
    };

    const handleDelete = async (id) => {
        await fetch(`http://localhost:5000/api/clusters/${id}`, {
            method: 'DELETE',
        });
        setClusters(prev => prev.filter(cluster => cluster.id !== id));
    };

    return (
        <Card
            title="Cluster Information"
            bordered={false}
            extra={<Button type="primary" onClick={() => showModal(null)}>Add Cluster</Button>}
        >
            {loading ? (
                <Spin />
            ) : (
                <List
                    dataSource={clusters}
                    renderItem={item => (
                        <List.Item
                            actions={[                               
                                <Button type="link" onClick={() => showModal(item)}>Edit</Button>,
                                <Button type="link" onClick={() => handleDelete(item.id)}>Delete</Button>,
                                <Button type="link" onClick={() => onDetails(item.id)}>Details</Button>,
                            ]}
                        >
                            <div>
                                <strong>ID:</strong> {item.id} <br />
                                <strong>Name:</strong> {item.name} <br />
                                <strong>Status:</strong> {item.status} <br />
                                <strong>Nodes:</strong> {item.nodes} <br />
                                <strong>Label:</strong> {item.label} <br />
                                <strong>Endpoint:</strong> {item.endpoint}
                            </div>
                        </List.Item>
                    )}
                />
            )}
            <Modal 
                title={currentCluster ? "Edit Cluster" : "Add Cluster"} 
                visible={isModalVisible} 
                // onOk={handleOk} 
                onCancel={() => setIsModalVisible(false)}
                // okText="Save"
                // cancelText="Cancel"
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)} style={{ marginLeft: '0px',marginBottom:'8px' }}>
                        Cancel
                    </Button>,
                    <Button key="save" type="primary" onClick={handleOk} style={{ marginLeft: '0px' }}>
                        Save
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    {!currentCluster && (
                        <>
                            <Form.Item 
                                name="name" 
                                label="Cluster Name" 
                                rules={[{ required: true, message: 'Please input the cluster name!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item 
                                name="endpoint" 
                                label="Cluster Endpoint" 
                                rules={[{ required: true, message: 'Please input the cluster endpoint!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </>
                    )}
                    <Form.Item 
                        name="label" 
                        label="Cluster Label" 
                        rules={[{ required: true, message: 'Please input the label!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default ClusterInfo;
