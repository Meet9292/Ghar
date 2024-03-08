import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique:true,
    },
    email:{
        type:String,
        required: true,
        unique:true,
    },
    password:{
        type:String,
        required: true,
    },
    avatar:{
        type:String,
        dafault: "https://th.bing.com/th/id/OIP.mpXg7tyCFEecqgUsoW9eQwHaHk?w=186&h=190&c=7&r=0&o=5&dpr=1.5&pid=1.7"
    }
},{timestamps:true})

const User = mongoose.model('Users',userSchema)

export default User