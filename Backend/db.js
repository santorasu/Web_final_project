const mongoose = require('mongoose');

const connectDb= async () => {
    try {
        await mongoose.connect(process.env.MONGO);
    } catch (error) {
        console.log('Error connecting to MongoDB Atlas:', error);
    }
}

module.exports = connectDb;