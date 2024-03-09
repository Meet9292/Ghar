import mongoose from 'mongoose'
import validator from 'validator'

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique:true,
    },
    email:{
        type:String,
        required: true,
        unique:[true,"Email id is already present"],
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("This Email is Not Valid")
            }
        }
    },
    password:{
        type:String,
        required: true,
    },
    avatar:{
        type:String,
        dafault: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    }
},{timestamps:true})

const User = mongoose.model('Users',userSchema)

export default User