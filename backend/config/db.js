import mongoose from "mongoose";

const connectdb=async()=>{
    try{
    await mongoose.connect(process.env.mongodb_url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
        console.log("db connected successfully!");
    }
    catch(err){
        console.log("db connection failed!", err);
        process.exit(1);
    }
}

export default connectdb;