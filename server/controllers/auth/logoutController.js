
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