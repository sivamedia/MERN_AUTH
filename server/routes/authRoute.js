import express from 'express'
import { isAuthenticated } from '../controllers/authController.js';
import { register } from '../controllers/auth/registerController.js';
import { login   } from '../controllers/auth/loginController.js';
import { logout } from '../controllers/auth/logoutController.js';
import { verifyEmail } from '../controllers/auth/emailOtpVerification.js'
import { sendVerifyOtp } from '../controllers/auth/sendOtpController.js';
import { sendResetOtp } from '../controllers/auth/sendResetOtp.js';
import { resetPassword } from '../controllers/auth/resetPassword.js';

import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.get('/is-auth',userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter 