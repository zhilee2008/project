import React, { useEffect, useState } from 'react';
import { Card, Select } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const { Option } = Select;

const MetricsDisplay = () => {
    const [metrics, setMetrics] = useState({ cpu: 0, memory: 0 });
    const [cpuData, setCpuData] = useState([]);
    const [memoryData, setMemoryData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [timeRange, setTimeRange] = useState(1); // 默认显示1分钟的数据

    useEffect(() => {
        const interval = setInterval(() => {
            const timestamp = new Date().toLocaleTimeString();
            const cpuUsage = Math.floor(Math.random() * 100);
            const memoryUsage = Math.floor(Math.random() * 100);

            setMetrics({ cpu: cpuUsage, memory: memoryUsage });

            // 根据所选时间范围限制数据点数量
            const maxDataPoints = timeRange * 60; // 每秒一个数据点

            setCpuData(prevData => [...prevData.slice(-maxDataPoints + 1), cpuUsage]);
            setMemoryData(prevData => [...prevData.slice(-maxDataPoints + 1), memoryUsage]);
            setLabels(prevLabels => [...prevLabels.slice(-maxDataPoints + 1), timestamp]);
        }, 1000); // 每1秒生成一个数据点

        return () => clearInterval(interval);
    }, [timeRange]);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'CPU Usage (%)',
                data: cpuData,
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                pointRadius: 2,
                pointHoverRadius: 5,
            },
            {
                label: 'Memory Usage (%)',
                data: memoryData,
                fill: false,
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                pointRadius: 2,
                pointHoverRadius: 5,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        },
        plugins: {
            tooltip: {
                enabled: true,
                mode: 'nearest',
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.raw}%`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time',
                    font: { size: 12 },
                },
                ticks: { font: { size: 10 } }
            },
            y: {
                title: {
                    display: true,
                    text: 'Usage (%)',
                    font: { size: 12 },
                },
                min: 0,
                max: 100,
                ticks: { font: { size: 10 } }
            }
        }
    };

    return (
        <Card title="Metrics Display" bordered={false} style={{ width: 800 }}>
            <Select 
                defaultValue={1} 
                style={{ width: 120, marginBottom: 16 }} 
                onChange={value => setTimeRange(value)}
            >
                <Option value={1}>1 Minute</Option>
                <Option value={5}>5 Minutes</Option>
                <Option value={10}>10 Minutes</Option>
            </Select>
            <div style={{ height: 400 }}>
                <Line data={data} options={options} />
            </div>
        </Card>
    );
};

export default MetricsDisplay;
