import mongoose from "mongoose"
//import {normalize,shema} from 'normalizr'

const collection = 'chat'
const chatSchema = mongoose.Schema({
    id:Number,
    mensajes:[]
    
})

mongoose.connect('mongodb+srv://diego:toyboyaco07@diegocastcluster.9lpsglb.mongodb.net/Chat?retryWrites=true&w=majority')
let db = mongoose.model(collection,chatSchema)

export default class chatContainer{

    save = async(data) =>{
       // await db.insertMany({id:10000,mensajes:[]})
       if(await db.countDocuments() === 0) await db.insertMany({id:10000,mensajes:[]})
       await db.updateMany({id:10000},{$push:{mensajes:data}})
       return "Listo"
    }
    getAll = async() =>{
      if(await db.countDocuments() === 0) return[]
       let data = await db.find({id:10000},{_id:0,mensajes:1})
       let finaliData = data[0].mensajes
       return finaliData

    }
    getAllNormalize = async() =>{
        let data = await db.find()
        let finaldata = data[0]
        return finaldata
 
     }
}

