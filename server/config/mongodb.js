import mongoose from "mongoose";

const connectDB = async ()=> {
    mongoose.connection.on('connected', ()=>console.log("Data Base Connected"));
    await mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`);
}

export default connectDB;