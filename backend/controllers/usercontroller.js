import mongoose from "mongoose";
import usermodel from '../models/usermodel.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import validator from 'validator';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const register= async(req,res)=>{
    const {fullname,pswd,confirmpswd,email,gender,dob,avatar,phoneno,alternatephone,address,medicalconditions,allergies,bloodgrp,lastlocation,emergencycontacts}=req.body;
    if(!pswd||!fullname||!email){
        return res.json({message:"All fields are required!"});
    }
    if (!validator.isEmail(email)) {
  return res.json({ message: "Please enter a valid email address!" });
}
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
if (!gmailRegex.test(email)) {
  return res.json({ message: "Only valid Gmail addresses allowed!" });
}
    if((pswd!=confirmpswd)){
        return res.json("Passwords do not match!");
    }

    try{
        const userexists=await usermodel.findOne({email});
        if(userexists){
            return res.json({message:"Email already exists!"});
        }
        const hashedpswd=await bcrypt.hash(pswd,7);

        const createnewuser=await usermodel.create({
            fullname,
            pswd:hashedpswd,
            email,
            gender:gender||"",
            dob:dob||"",
            avatar:avatar||"",
            phoneno:phoneno||"",
            alternatephone:alternatephone||"",
            address:address||"",
            medicalconditions:medicalconditions||"",
            allergies:allergies||"",
            bloodgrp:bloodgrp||"",
            lastlocation:lastlocation||"",
            emergencycontacts:emergencycontacts||[]
        });

const token = jwt.sign(
    { id: createnewuser._id },
    process.env.JWT_SECRET, {
    expiresIn: "7d",
});

res.status(201).json({
  message: "User registered successfully!",
  token,
  user: {
    id: createnewuser._id,
    fullname: createnewuser.fullname,
    email: createnewuser.email,
  }
});
    }
    catch(err){
        console.log("Error in registration!", err.message);
        res.json({message:"Server Error!", error:err.message});
    }
};

export const login=async(req,res)=>{
    const{email,pswd}=req.body;
    if(!email||!pswd){
        return res.json({ message: "All fields are required!" });
    }
    try{
        const user=await usermodel.findOne({
            email:email,
        });
        if(!user){
            return res.json({message:"Invalid user!"});
        }
        const pswdcheck=await bcrypt.compare(pswd, user.pswd);
        if(!pswdcheck) {
            return res.json({message:"Invalid credentials!"});
        }

        const token=jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"5d"}
        );
        console.log("Generated Token:", token); //just verifyin whether its actually made or not!
      return res.json({
            message:"Login successful!",
            token,
            user:{
                id:user._id,
                fullname:user.fullname,
                email:user.email,
                emergencycontacts: user.emergencycontacts || []
            }
        });
    }
    catch(err){
    console.log("Login error:", err.message);
    res.status(500).json({ message: "Server error!", error: err.message });
    }
};

export const logout=async(req,res)=>{
    await AsyncStorage.clear(); //clearing the saved token!
    NavigationActivation.reset({
        index:0,
        routes:[{name:'Landing'}], //heads to landing pg
    });
}

export const getuserdetails=async(req,res)=>{
// user is available only becoz i did req.user = user in middleware//can be accessed in getuserdetails func also!!!
const response = await usermodel.findOne({ _id: req.user.id }).select('-pswd');
console.log("Decoded user from middleware:", req.user);

return res.json(response);
}

export const adduserdetails=async(req,res)=>{
    
    
    const {fullname,gender,dob,bloodgrp,phoneno,alternatephone,address,medicalconditions,allergies,lastlocation,emergencycontacts}= req.body;
    const  userid=req.user.id // user.id is available due to middleware func!
    console.log("Decoded user from middleware:", req.user);

const updatedfields = {};

if (fullname) updatedfields.fullname = fullname;
if (gender) updatedfields.gender = gender;
if (dob) updatedfields.dob = dob;
if (bloodgrp) updatedfields.bloodgrp = bloodgrp;
if (phoneno) updatedfields.phoneno = phoneno;
if (alternatephone) updatedfields.alternatephone = alternatephone;
if (address) updatedfields.address = address;
if (medicalconditions) updatedfields.medicalconditions = medicalconditions;
if (allergies) updatedfields.allergies = allergies;
if (lastlocation) updatedfields.lastlocation = lastlocation;
if (emergencycontacts) updatedfields.emergencycontacts = emergencycontacts;

const addnewdetails = await usermodel.findOneAndUpdate(
  { _id: userid },
  { $set: updatedfields },
  { new: true }
);

    return res.json(addnewdetails);
}


export const updateEmergencyContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { emergencycontacts } = req.body;

    if (!Array.isArray(emergencycontacts)) {
      return res.status(400).json({ message: "Invalid contacts array." });
    }

    const user = await usermodel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.emergencycontacts = emergencycontacts;
    await user.save();

    res.status(200).json({
      message: "Emergency contacts updated successfully.",
      emergencycontacts: user.emergencycontacts,
    });
  } catch (err) {
    console.error("Error updating contacts:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};


export const deletecontact=async(req,res)=>{
    try{
        await usermodel.updateOne(
            //_id is mandatory for updateone query or any mongo queries!!!
            {_id: req.user.id}, //finds in mongodb whose _id has any field equal to this req.user.id ->(from json webtoken-user.id!)
            {$pull:{emergencycontacts:{ id:Number(req.params.id) }}} //pull=remove => remove custom id field that equals req.params.id(our id from frontend!, Number(req.params.id) coz it was a date!)!
            //also emer.contacts has a field called id, if that id==req.params.id, then only it will delete!
        );
    }
    catch(err){
        res.json({error:"server issue!"});
    }
};