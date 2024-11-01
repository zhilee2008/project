const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { swaggerUi, specs } = require('./swagger');

const app = express();
const PORT = 5000;


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const users = [
    { username: 'admin', password: 'admin' }, 
];

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid username or password');
    }
});



const clustersRouter = require('./routes/clusters');
const filesRouter = require('./routes/files');
const metricsRouter = require('./routes/metrics'); 
const foldersRouter = require('./routes/folders')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/clusters', clustersRouter);
app.use('/api/folders', foldersRouter);
app.use('/api/files', filesRouter);
app.use('/api/metrics', metricsRouter); 


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
