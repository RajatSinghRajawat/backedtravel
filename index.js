const express = require('express');
// const authRoutes = require('./routes/authRoutes');
const connectDB = require('./src/config/db');

const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const router = require('./src/routes/authRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public/Uploads"))
app.use('/api/auth', router);
connectDB()

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
