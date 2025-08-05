import mongoose from "mongoose";
import * as dotenv from 'dotenv'
dotenv.config()

const uri = `mongodb+srv://ranvin789:${process.env.DB_PASSWORD}@cluster0.sxk5t1w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const mongoDb = async() =>{
    try{
        mongoose.connect(uri)
        console.log("Database Connected Successfully")
    }
    catch(error){
        console.log(error)
    }
}

export default mongoDb;