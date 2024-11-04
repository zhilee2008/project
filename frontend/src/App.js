import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login'; // 引入登录组件
import Dashboard from './components/Dashboard';

const API_BASE_URL = 'http://localhost:5000/api';
// 模拟认证
const isAuthenticated = () => {
    return sessionStorage.getItem('isAuthenticated') === 'true'; // 简单的认证状态
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={isAuthenticated() ? <Dashboard apiBaseUrl={API_BASE_URL}/> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Navigate to="/" />} /> {/* Redirecting to root */}
            </Routes>
        </Router>
    );
};

export default App;
