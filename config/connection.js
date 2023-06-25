const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/go-social");

module.exports = mongoose.connection;