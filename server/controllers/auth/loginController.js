import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../../models/userModel.js';


//User Login
export const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.json({success: false, message: ' Email and Password are required'})
    }
    try{
       const user = await userModel.findOne({email});
       if(!user){
        return res.json({success: false, message: 'Invalid email'});
       }
       const isMatch = await bcrypt.compare(password, user.password);
       if(!isMatch) {
        return res.json({success: false, message: 'Invalid Password'});
       }
       const token = jwt.sign({id:user._id},process.env.JWT_SECRET, {expiresIn:'7d'})

       res.cookie('token', token, {
           httpOnly: true,
           secure: process.env.NODE_ENV === 'production',
           sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
           maxAge: 7 * 24 * 60 * 60 * 1000
       })

       return res.json({success: true, message: 'User Logged In Successfully'});

    } catch (error) {
        return res.json({success: false, message: error.message})
    }

}