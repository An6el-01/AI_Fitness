const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database.js');
require('dotenv').config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Connect to MongoDB
connectDB();

//Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/plans', require('./routes/workoutRoutes'));

if( require.main === module){
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
