import userModel from '../../models/userModel.js';

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