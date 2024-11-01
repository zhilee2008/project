import React, { useEffect, useState } from 'react';
import { Table, Select, Divider } from 'antd';

const { Option } = Select;

const ClusterDetails = ({ clusterId }) => {
    const [cluster, setCluster] = useState(null);
    const [nodes, setNodes] = useState([]);
    const [namespaces, setNamespaces] = useState([]);
    const [selectedNamespace, setSelectedNamespace] = useState('default');
    const [workloads, setWorkloads] = useState([]);

    useEffect(() => {
        const fetchCluster = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/clusters/${clusterId}`);
                const data = await response.json();
                setCluster(data);
                setNodes(data.nodes || []); 
                setNamespaces(data.namespaces || []); 
                setSelectedNamespace(data.namespaces[0]?.name || 'default');
                setWorkloads(data.namespaces[0]?.workloads || []);
            } catch (error) {
                console.error('Error fetching cluster information:', error);
            }
        };
        if (clusterId) fetchCluster();
    }, [clusterId]);

    const handleNamespaceChange = (namespaceName) => {
        setSelectedNamespace(namespaceName);
        const namespace = namespaces.find(ns => ns.name === namespaceName);
        setWorkloads(namespace?.workloads || []);
    };

    // Node table columns
    const nodeColumns = [
        {
            title: 'Node Type',
            dataIndex: 'type',
            key: 'type',
            render: (text) => (text === 'master' ? 'Master' : 'Worker'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (status === 'on' ? 'On' : 'Off'),
        },
    ];

    // Workload table columns
    const workloadColumns = [
        {
            title: 'Workload Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
    ];

    return (
        <div>
            <h2>Cluster Details</h2>
            {cluster ? (
                <div>
                    <p><strong>ID:</strong> {cluster.id}</p>
                    <p><strong>Name:</strong> {cluster.name}</p>
                    <p><strong>Status:</strong> {cluster.status}</p>
                    <p><strong>Label:</strong> {cluster.label}</p>
                    <p><strong>Endpoint:</strong> {cluster.endpoint}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}

            <Divider />

            {/* Node Table */}
            <h3>Nodes</h3>
            <Table 
                columns={nodeColumns} 
                dataSource={nodes} 
                rowKey="id" 
                pagination={false} 
            />

            <Divider />

            {/* Namespace Selector */}
            <h3>Namespaces</h3>
            <Select 
                value={selectedNamespace}
                style={{ width: 200, marginBottom: 16 }}
                onChange={handleNamespaceChange}
            >
                {namespaces.map((namespace) => (
                    <Option key={namespace.name} value={namespace.name}>
                        {namespace.name}
                    </Option>
                ))}
            </Select>

            {/* Workload Table */}
            <h3>Workloads in Namespace: {selectedNamespace}</h3>
            <Table 
                columns={workloadColumns} 
                dataSource={workloads} 
                rowKey="id" 
                pagination={false} 
            />
        </div>
    );
};

export default ClusterDetails;
