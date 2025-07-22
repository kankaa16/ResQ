import mongoose from "mongoose";
const emergencyschema= new mongoose.Schema({
    emergencynames:{
        type:String,
        required:true,
    },
    emergencynumbers:{
        type:String,
        required:true,
    },
});

export default mongoose.model("emergency", emergencyschema);
