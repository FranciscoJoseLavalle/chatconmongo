import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import faker from 'faker';
import services from './dao/index.js';
import { normalize, schema } from 'normalizr';

const app = express();
const server = app.listen(8080, () => console.log("Escuchando en puerto 8080"));
const io = new Server(server);

faker.locale = 'es';

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);

const { commerce, image } = faker;
app.get('/api/products-test', (req, res) => {
    let testProducts = [];
    for (let i = 0; i < 5; i++) {
        testProducts.push({
            name: commerce.product(),
            price: commerce.price(),
            thumbnail: image.imageUrl()
        })
    }
    res.send(testProducts);
})

io.on('connection', async socket => {
    console.log('Socket connected');
    socket.broadcast.emit('newUser')

    socket.on('userConnected', async (data) => {
        let message = await services.messagesService.getAll();
        await io.emit('log', message);

        let product = await services.productsService.getAll();
        await io.emit('sendProduct', product)
    })

    socket.on('message', async (data) => {
        await services.messagesService.save(data)
        let message = await services.messagesService.getAll();
        await io.emit('log', message);
    })

    socket.on('addProduct', async (data) => {
        await services.productsService.getAll();
        await services.productsService.save(data);
        let product = await services.productsService.getAll();
        await io.emit('sendProduct', product)
    })
})


app.get('/normalizr', async (req, res) => {
    let chatMessages = await services.messagesService.getAll();
    let chatArray = {
        id: 'messagesID',
        messages: chatMessages
    }
    const author = new schema.Entity('authors');
    const message = new schema.Entity('messages', {
        author: author
    });
    const chat = new schema.Entity('chat', {
        author: author,
        messages: [message]
    })
    
    const normalizedData = normalize(chatArray, chat);

    console.log(JSON.stringify(normalizedData, null, '\t'));
    console.log(JSON.stringify(chatArray, null).length);
    res.send(normalizedData);
})