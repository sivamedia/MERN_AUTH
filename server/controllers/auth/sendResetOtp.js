import userModel from '../../models/userModel.js';
import transporter from '../../config/nodemailer.js';

// Send Reset Password OTP

export const sendResetOtp = async(req, res)=> {
    const{ email} = req.body;
    if(!email) {
        return res.json({success: false, message: "Email is required"})
    }

    try {
           const user = await userModel.findOne({email})
           if(!user) {
             return res.json({success:false, message: 'User not Found'})
           }

           const otp = String(Math.floor(100000 + Math.random()* 900000));
           user.resetOtp = otp;
           user.resetOtpExpiredAt = Date.now() + 2 * 24 * 60 * 60 * 1000

           await user.save()

           const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Password Reset Verification OTP for  MERN-AUTH-STACK',
            text: `Your OTP is ${otp} to Resetting  your password for account MERN_AUTH_STACK at Sivamedia with  ${user.email}
            your OTP Will Exipire by ${new Date(user.resetOtpExpiredAt)}`

           }
           await transporter.sendMail(mailOptions);

           return res.json({success: true, message: 'Your Password reset Verification OTP Sent on Email'});
    } catch(error) {
        return res.json({ success: true, message: error.message});
    }
}