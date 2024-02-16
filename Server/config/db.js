const mongoose = require("mongoose");

const connect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
          useNewUrlParser: true,
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.log(`Error occured while connecting to database: ${error}`)
    }
}

module.exports = connect;