import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

// Sign up api route
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  const hashedPassword = bcryptjs.hashSync(password,10)

  const newUser = new User({ username, email, password : hashedPassword });

  try {
      await newUser.save()
      res.status(201).json("User Created Successfully")
    
  } catch (error) {
    next(error)
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
