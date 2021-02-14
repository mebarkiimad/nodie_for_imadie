import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import User, { user } from './../models/userModel';
import{ ac} from '../roles';
import { Permission } from 'accesscontrol';

const token:string='AF301B046AC6BEB3C9B964B1D6A5EB197C191163C0D9453E84EB394705CC56D9';
const hashPassword = async (password:string):Promise<string>=> await bcrypt.hash(password, 10);
const validatePassword = async (plainPassword:string,hashedPassword:string):Promise<boolean> => await bcrypt.compare(plainPassword, hashedPassword);

const signup: (req: Request, res: Response, next: NextFunction) => Promise<void>
 = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
    try{
        const { email, password, role } = req.body
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ email, password: hashedPassword, role: role || "basic" });
        const accessToken = jsonwebtoken.sign({ userId: newUser._id }, token, {
            expiresIn: "365d"
           });
           
           newUser.accessToken = accessToken;
           await newUser.save();
           res.json({
            data: newUser,
            accessToken
           })
           
    } catch(error:any){

    next(error);
    }
    const { email, password, role } = req.body
}
const signin = async (req:Request, res:Response, next:NextFunction) => {
    try {
     const { email, password } = req.body;
     const user = await User.findOne({ email });
     if (!user) return next(new Error('Email does not exist'));
     const validPassword = await validatePassword(password, user.password);
     if (!validPassword) return next(new Error('Password is not correct'))
     const accessToken = jsonwebtoken.sign({ userId: user._id },token, {
      expiresIn: "1d"
     });
     await User.findByIdAndUpdate(user._id, { accessToken })
     res.status(200).json({
       id:user._id  , email: user.email, role: user.role,accessToken}
     )
    } catch (error) {
     next(error);
    }
   }
   const getUsers = async (req:Request, res:Response, next:NextFunction) =>{
    const users = await User.find({});
    res.status(200).json({
        data: users
       });

   }
const getUser= async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) return next(new Error('User does not exist'));
         res.status(200).json({
         data: user
        });
       } catch (error) {
        next(error)
       }


}
const updateUser = async (req:Request, res:Response, next:NextFunction)  => {
    try {
     const update = req.body
     const userId = req.params.userId;
     await User.findByIdAndUpdate(userId, update);
     const user = await User.findById(userId)
     res.status(200).json({
      data: user,
      message: 'User has been updated'
     });
    } catch (error) {
     next(error)
    }
   }
const deleteUser = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const userId = req.params.userId;
        await User.findByIdAndDelete(userId);
        res.status(200).json({
         data: null,
         message: 'User has been deleted'
        });
       } catch (error) {
        next(error)
       }


}

const grantAccess = (action:string,resource:any) => async (req:Request, res:Response, next:NextFunction) =>{
   
     try{
      const role  = req.currentUser.role as string;
    const permission:Permission = ac.can(role).readAny(resource);
    if (!permission.granted) {
        return res.status(401).json({
         error: "You don't have enough permission to perform this action"
        });
    }
    next();
}catch(error){
   
    next(error);
}
}

const allowIfLoggedIn =  async (req:Request, res:Response, next:NextFunction) => {
    try {
     const _user:user = res.locals.loggedInUser as user;
    
     if (!_user)
      return res.status(401).json({
       error: "You need to be logged in to access this route"
      });
   
      req.currentUser = _user;
      next();
     } catch (error) {
      next(error);
     }
   }
   export default {signin,signup,getUsers,getUser,updateUser,deleteUser,grantAccess,allowIfLoggedIn};