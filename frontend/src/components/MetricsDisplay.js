import React, { useEffect, useState } from 'react';
import { Line } from '@ant-design/charts';

const MetricsDisplay = () => {
    const [metricsData, setMetricsData] = useState([]);
    const [cpuUsage, setCpuUsage] = useState(0);
    const [memoryUsage, setMemoryUsage] = useState(0);
    function formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
       
        // 将小时、分钟、秒数补齐到两位数
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
       
        return hours + ':' + minutes + ':' + seconds;
      }

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/metrics');
                const data = await response.json();

                const cpu = parseFloat(data.cpuUsage) || 0;
                const memory = parseFloat(data.memoryUsage) || 0;

                setCpuUsage(cpu);
                setMemoryUsage(memory);

                const currentTimestamp = Date.now(); // 使用毫秒时间戳

                setMetricsData((prevData) => {
                    const newData = [
                        ...prevData,
                        {
                            Time: formatTime(new Date(currentTimestamp)),
                            timestamp: currentTimestamp, 
                            cpuUsage: cpu,
                            memoryUsage: memory,
                        }
                    ];

                    // 保留最近一分钟的数据
                    return newData.filter(item => item.timestamp >= currentTimestamp - 60000);
                });
            } catch (error) {
                console.error('获取系统指标时出错:', error);
            }
        };

        // 每隔 5 秒获取一次数据
        const intervalId = setInterval(fetchMetrics, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const lineConfigCpu = {
        data: metricsData,
        xField: 'Time',
        yField: 'cpuUsage',
        smooth: true,
        height: 200,
        point: { size: 2, shape: 'circle' },
        color: '#3fa7dc',
        label: {
            formatter: (text) => `${parseFloat(text).toFixed(2)}%`
        },
    };

    const lineConfigMem = {
        data: metricsData,
        xField: 'Time',
        yField: 'memoryUsage',
        smooth: true,
        height: 200,
        point: { size: 2, shape: 'circle' },
        color: '#3fa7dc',
        label: {
            formatter: (text) => `${parseFloat(text).toFixed(2)}%`
        },
    };

    return (
        <div>
        <h2>System Metrics</h2>
       
        <div style={{ marginTop: 20 }}>
            <h3>CPU Usage Over Time</h3>
            <Line {...lineConfigCpu} />
            <h3>Memory Usage Over Time</h3>
            <Line {...lineConfigMem} />
        </div>
    </div>

    );
};

export default MetricsDisplay;
