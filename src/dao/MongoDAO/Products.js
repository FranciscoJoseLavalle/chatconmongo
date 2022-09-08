import mongoose from "mongoose";
import MongoDBContainer from "./MongoDBContainer.js";

const collection = 'products';
const userSchema = mongoose.Schema({
    name: String,
    price: Number,
    thumbnail: String
})

export default class Users extends MongoDBContainer {
    constructor() {
        super(collection, userSchema)
    }
};