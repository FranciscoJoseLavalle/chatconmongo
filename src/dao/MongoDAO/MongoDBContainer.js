import mongoose from 'mongoose';

export default class MongoDBContainer {
    constructor(collection, schema) {
        mongoose.connect('mongodb+srv://fran:coder123@chatandproductscluster.rysqzs7.mongodb.net/?retryWrites=true&w=majority')
        this.model = mongoose.model(collection, schema);
    }

    getAll = async() => {
        let results = await this.model.find();
        return results;
    }
    save = async(document) => {
        let results = await this.model.create(document);
        return results;
    }
}