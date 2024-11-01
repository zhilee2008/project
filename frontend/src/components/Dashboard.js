import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { LogoutOutlined, ClusterOutlined, FolderOutlined, BarChartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import ClusterInfo from './ClusterInfo';
import FolderDisplay from './FolderDisplay';
import MetricsDisplay from './MetricsDisplay';
import ListFolder from './ListFolder';
import ClusterDetails from './ClusterDetails';
import './Dashboard.css';

const { Header, Sider, Content } = Layout;

const Dashboard = ({ apiBaseUrl }) => {
    const [currentTab, setCurrentTab] = useState('1');
    const [selectedClusterId, setSelectedClusterId] = useState(null);
    const navigate = useNavigate();
    const currentUser = 'Admin';

    const handleLogout = () => {
        sessionStorage.setItem('isAuthenticated', 'false');
        navigate('/login');
    };

    const handleMenuClick = (e) => {
        setCurrentTab(e.key);
        setSelectedClusterId(null);
    };

    // 生成面包屑路径
    const breadcrumbItems = () => {
        const items = [
            
        ];
        
        if (currentTab === '1') {
            items.push(
                <Breadcrumb.Item key="clusterInfo">
                    {selectedClusterId ? (
                        <Link onClick={() => setSelectedClusterId(null)}>Cluster Info</Link>
                    ) : (
                        'Cluster Info'
                    )}
                </Breadcrumb.Item>
            );

            if (selectedClusterId) {
                items.push(
                    <Breadcrumb.Item key="clusterDetails">Cluster Details</Breadcrumb.Item>
                );
            }
        } else if (currentTab === '2') {
            items.push(<Breadcrumb.Item key="folders">Folders</Breadcrumb.Item>);
        } else if (currentTab === '3') {
            items.push(<Breadcrumb.Item key="metrics">Metrics</Breadcrumb.Item>);
        } else if (currentTab === '4') {
            items.push(<Breadcrumb.Item key="folderShow">FolderShow</Breadcrumb.Item>);
        }

        return items;
    };


    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={200} className="site-layout-background">
                <div className="header" style={{  padding: '2px', color: '#fff', textAlign: 'center', fontSize: '20px' }}>
                    Backend Management
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[currentTab]}
                    onClick={handleMenuClick}
                    style={{ height: '100%', borderRight: 0 }}
                >
                    <Menu.Item key="1" icon={<ClusterOutlined />}>Cluster Info</Menu.Item>
                    <Menu.Item key="2" icon={<FolderOutlined />}>Folders</Menu.Item>
                    <Menu.Item key="3" icon={<BarChartOutlined />}>Metrics</Menu.Item>
                    <Menu.Item key="4" icon={<FolderOutlined />}>FolderShow</Menu.Item>
                </Menu>
            </Sider>
                
            <Layout>
                <Header style={{ background: '#001529', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#fff' }}>Backend Management System</div>
                    <div className="user-info" style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
                        <span style={{ marginRight: 10 }}>{currentUser}</span>
                        <LogoutOutlined 
                            onClick={handleLogout} 
                            style={{ fontSize: '24px', cursor: 'pointer', color: '#fff' }} 
                        />
                    </div>
                </Header>
                

                <Content style={{ margin: '16px' }}>
                <Breadcrumb style={{ marginBottom: '16px' }}>
                     <Breadcrumb.Item>Home</Breadcrumb.Item>
                     {breadcrumbItems()}
                    </Breadcrumb>
                    <div className="content" style={{ padding: 20, backgroundColor: '#fff', borderRadius: 4, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                        {currentTab === '1' && (
                            selectedClusterId 
                            ? <ClusterDetails clusterId={selectedClusterId} /> 
                            : <ClusterInfo onDetails={setSelectedClusterId} />
                        )}
                        {currentTab === '2' && <FolderDisplay apiBaseUrl={apiBaseUrl} />}
                        {currentTab === '3' && <MetricsDisplay />}
                        {currentTab === '4' && <ListFolder />}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;
