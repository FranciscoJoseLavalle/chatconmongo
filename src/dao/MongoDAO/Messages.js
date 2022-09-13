import mongoose from "mongoose";
import MongoDBContainer from "./MongoDBContainer.js";

const collection = 'messages';
const userSchema = mongoose.Schema({
    user: Object,
    message: String,
    date: String
})

export default class Users extends MongoDBContainer {
    constructor() {
        super(collection, userSchema)
    }
};