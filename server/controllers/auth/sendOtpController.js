import userModel from '../../models/userModel.js';
import transporter from '../../config/nodemailer.js';

export const sendVerifyOtp = async(req, res)=> {
    try {
    console.log("sendVerifyOtp ===> ", req.body.userId)
     const {userId} = req.body;

     const user = await userModel.findById(userId);

     if(user.isAccountVerified) {
        return res.json({success: false, message: "Account Already Verified"});
     }

     const otp = String(Math.floor(100000 + Math.random()* 900000));
     user.verifyOtp = otp;
     user.verifyOtpExpiredAt = Date.now() + 2 * 24 * 60 * 60 * 1000


     await user.save()

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP for  MERN-AUTH-STACK',
            text: `Your OTP is ${otp} to Verify your account MERN_AUTH_STACK at Sivamedia with  ${user.email}
            your OTP Will Exipire by ${new Date(user.verifyOtpExpiredAt)}`

        }
        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: 'Verification OTP Sent on Email'});

    }catch(error) {
        res.json({success: false, message: error.message })
    }
}