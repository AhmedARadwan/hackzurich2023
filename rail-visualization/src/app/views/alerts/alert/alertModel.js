// alertModel.js
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    switchid: String,
    usecount: String,
    message: String,
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Alert', alertSchema);
