const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    name:{type: String, required: [true, "The name of the connection is required!"]},
    topic: {type: String, required: [true, "The topic of the connection is required!"]},
    details: {type: String, required:[true, "The details of the connection is required!"]},
    date: {type: String, required: [true, "The date of the connection is required!"]},
    start_Time: {type: String, required: [true, "The start time of the connection is required!"]},
    end_Time: {type: String, required: [true, "The end time of the connection is required!"]},
    host_Name:{type: Schema.Types.ObjectId, ref: "User"},
    imageURL: {type: String, required: [true, "The date of the connection is required!"]},
});



module.exports = mongoose.model("Connection", connectionSchema);