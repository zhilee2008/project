// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger 配置
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Files and Folders API',
            version: '1.0.0',
            description: 'API for managing files and folders',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Local server',
            },
        ],
    },
    apis: ['./routes/*.js'], // 指定 API 路由文件路径
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
