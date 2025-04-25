import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

//New User Registration
export const register = async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.json({success: false, message: 'Missing Details'})
    }

    try {
        
        const existingUser = await userModel.findOne({email})
        if(existingUser) {
            return res.json({success: false, message: 'User already Exists'})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new userModel({
            name, email, password:hashedPassword
        });
        await user.save();

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET, {expiresIn:'7d'})
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        // Sending welcom email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to MERN-AUTH-STACK',
            text: `Welcome to the MERN_AUTH_STACK at Sivamedia. Your Account has been created with the email ${email}`

        }
        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: 'User Registration Successfull'});

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}
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
// User LogOut
export const logout = async (req,res)=> {
 try {
   res.clearCookie('token',{
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
   })
 
   return  res.json({success: true, message: "Logged Out"})
 } catch (error) {
    return res.json({success: false, message: error.message})
 }
} 

// Send Verification OTP to the User's Email
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

// Email OTP Verification
export const verifyEmail = async(req, res)=> {
    const {userId, otp} = req.body;

    

    if(!userId || !otp) {
        return res.json({success: false, message: 'Missing Details'});
    }

    try {

        const user = await userModel.findById(userId);
        if(user.isAccountVerified) {
            return   res.json({success: true, message: 'User Account Already verified'});
        }

        if(!user) {
            return res.json({success: false, message: 'User Not Found'});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({success: false, message: 'Invalid Otp'});
        }

        if(user.verifyOtpExpiredAt < Date.now()) {
            res.json({success: false, message: 'OTP Expired' })
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiredAt = 0;


        await user.save();

        return res.json({success: true, message: 'Email Verification successfully done with OTP'});
        

    } catch(error) {
        res.json({success: false, message: error.message })
    }
}

// Check User Authenticated
export const isAuthenticated = async(req, res) => {

    try{
        return res.json({ success: true, message: 'User Authenticated'});

    } catch (error) {
        
        return res.json({ success: true, message: error.message});
    }
}

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

