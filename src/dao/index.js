import Products from './MongoDAO/Products.js';
import Messages from './MongoDAO/Messages.js';

let productsService = new Products();
let messagesService = new Messages();

const services = {
    productsService,
    messagesService
}

export default services;