const mongoose = require("mongoose")
const uri = "mongodb+srv://ranvin789:T1C5ViycjSZ4yP7H@cluster0.sxk5t1w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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