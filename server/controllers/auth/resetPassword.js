import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../../models/userModel.js';

// Reset User Password 

export const resetPassword = async(req, res) => {
    const {email, otp, newPassword} = req.body;
    if(!email || !otp || !newPassword){
        return res.json({success: false, message: 'Email, OTP and New Password are required'});
    }
    try {
        const user = await userModel.findOne({email})
        if(!user) {
          return res.json({success:false, message: 'User not Found'})
        }
        if(user.resetOtp ==="" || user.resetOtp !== otp) {
            return res.json({ success: true, message: 'Invalid OTP'});
        }
        if(user.resetOtpExpiredAt < Date.now()){
            return res.json({ success: true, message: 'OTP Expired'});
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpiredAt = 0;

        await user.save();
        return res.json({success: true, message: 'Your Password reset done Successfully'});


    } catch(error) {
        return res.json({ success: true, message: error.message});
    }
}