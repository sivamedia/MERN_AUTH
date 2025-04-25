import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    
    const {token} = req.cookies;
    if(!token) {
        return res.json({success: false, message: 'Not Authorized, Please Login Again'})
    }

    try {

        const tockenDecode =  jwt.verify(token, process.env.JWT_SECRET);
        if(tockenDecode.id) {
            req.body.userId = tockenDecode.id  // not Working so add in body request by UI or Postman
            console.log(" userAuth MiddleWare ========>", req.body.userId)
        } else {
            console.log("========>", req.body.userId)
            return res.json({success: false, message : 'Not Authorized, Please Login Again' })
        } 
        
        next();  // middle ware execution done pass throught route

    } catch(error) {
        console.log("userAuth MiddleWare Error ========> ")
        return res.json({success: false, message : error.message })
    }
}

export default userAuth;