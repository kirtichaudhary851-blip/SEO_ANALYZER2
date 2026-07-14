const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    result: {
        type: Object,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Analysis", analysisSchema);