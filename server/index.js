const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const ModuleRoutes = require('./Routes/ModuleRoutes');

//Express Server Setup
const app = express();
const port = process.env.PORT || 3001;

//Express Middlewares
app.use(express.json());
app.use(cors());

// Connection URL
const DB = process.env.MongoDB_URI;
mongoose.connect(DB)
    .then(() => {
        console.log('Connected to MongoDB Atlas');

        //Server status endpoint
        app.get('/', (req, res) => {
            res.send('Server is Up!');
        });

        //Routes
        app.use('/module', ModuleRoutes);

        app.listen(port, () => {
            console.log(`Node/Express Server is Up......\nPort: localhost:${port}`);
        });
    })
    .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));