import express from 'express'
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import chatContainer from './db/chatDB.js';
import faker from 'faker';
import {normalize,schema} from 'normalizr'


const db = new chatContainer();
const app = express()
const PORT = 8080;

const server = app.listen(PORT,()=>{
    console.log(`Èscuchando en el puerto ${PORT}`)
})
faker.locale='es'
const {commerce,image} = faker;
let productsFaker = []
for(let i =0;i<5;i++){
    productsFaker.push({
        title: commerce.product(),
        prices: commerce.price(),
        thumbnail: image.imageUrl()
    })
}


app.get('/normalizado',async(req,res)=>{
    try {
        let log = await db.getAllNormalize()
        const authors = new schema.Entity('author')
        const mensaje = new schema.Entity('mensajes',{
            author:authors,
        })
        const holdingSchema = new schema.Entity('holdings',{
            mensajes:[mensaje]
        })
    const normalizedData = normalize(log,holdingSchema)
    res.send( normalizedData)
    console.log('Data Normalizada = ',normalizedData)
    } catch (error) {
        console.log(error)
    }
})



const io = new Server(server);
app.use(express.json());
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars')
app.use(express.static(__dirname+'/public'))



io.on('connection',async(socket)=>{
    console.log("Socket connected")
    let log = await db.getAll()
    io.emit('log',log)

    socket.on('message',async data=>{
    let date = new Date().toISOString()
    data.fecha= date;
    await db.save(data)
    let log = await db.getAll()
       io.emit('log',log)
    console.log(data)
    })

})

app.get('/',async(req,res)=>{

        res.render('formulario',{
            productsFaker
        })
})

