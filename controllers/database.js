require('dotenv').config()
const mongoose = require('mongoose')
const connectionString = process.env.DB_CONFIG

const connectDB = async()=>{
    await mongoose.connect(connectionString).then(()=>console.log("DB connected..."))
}

const TaskShema = new mongoose.Schema({
    section : {
        type : String,
        required : [true , 'required field'],
        trim : true,
        maxlenght :[20, 'max lenght is 20 character'],
        default : "Demo section"
    },
    description :  {
        type : String,
        required : [true , 'required field'],
        trim : true,
        maxlenght :[30, 'max lenght is 30 character'],
        default : "Demo description"
    },
    code :  {
        type : String,
        required : [true , 'required field'],
        default : "Demo data code"
    }
})

const Section = new mongoose.Schema({
    section : {
        type : String,
        required : [true , 'required field'],
        trim : true,
        maxlenght :[20, 'max lenght is 20 character'],
        default : "Demo section"
    }
})

const model_section =  mongoose.model('section-git',Section)
const model = mongoose.model('git-code',TaskShema)

module.exports = { 
    connectDB, 
    model,
    model_section 
}