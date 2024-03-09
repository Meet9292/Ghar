import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

// Sign up api route
export const signup = async (req, res, next) => {
  const { username, email, password , avatar } = req.body;

  const hashedPassword = bcryptjs.hashSync(password,10)

  const defaultAvatar = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"

  const newUser = new User({ username, email, password : hashedPassword , avatar : defaultAvatar});

  try {
      await newUser.save()
      res.status(201).json("User Created Successfully")
    
  } catch (error) {
    next(error)
    // return next(errorHandler(401,'Email id is already present'))
  } 
};

// Sign in api route
export const signin = async (req,res,next)=>{
  const {email,password} = req.body

  try {
    const validuser = await User.findOne({email})
    if(!validuser)
    {
      return next(errorHandler(404,'User not Found!'))
    }
    const validPassword = bcryptjs.compareSync(password,validuser.password)
    if(!validPassword)
    {
      return next(errorHandler(401,'Password Incorrect!'))
    }

    const token = jwt.sign({id : validuser._id},process.env.JWT_SECRET)

    //Hides Password to user
    const {password: pass,...rest} = validuser._doc

    res
    .cookie('access_token',token,{httpOnly:true})
    .status(200)
    .json(rest)

  } catch (error) {
    next(error)
  }
}

export const google = async (req,res,next)=>{
  try {
    const user = await User.findOne({email:req.body.email})
  if(user){
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
    const {password:pass,...rest} = user._doc;
    res
    .cookie('access_token',token,{httpOnly:true})
    .status(200)
    .json(rest)
  }else
  {
    const generatedpassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
    const hashedPassword = bcryptjs.hashSync(generatedpassword,10)

    const newUser = new User({
      username : req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
      email:req.body.email,
      password:hashedPassword,
      avatar: req.body.photo
    })
    await newUser.save()
    const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET)
    const {password: pass,...rest} = newUser._doc
    res.cookie('access-token',token,{httpOnly:true}).status(200).json(rest)
  }
  } catch (error) {
    next(error)
  }
}

export const signout = async(req,res,next) =>{
  try {
    res.clearCookie('access_token')
    res.status(200).json('User has been logged out!')
  } catch (error) {
    next(error)
  }
}

