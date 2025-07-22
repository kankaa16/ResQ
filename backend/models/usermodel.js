import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false } // prevenst Mongodb's from adding its own _id to each contact 
);


const userschema= new mongoose.Schema({
    fullname: {
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true,
    },
    pswd:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        default:"",
    },

    dob:{
        type:String,
        default:"",
    },
    avatar:{
        type:String,
        default:"",
    },
    phoneno:{
        type:String,
        default:"",
    },
    alternatephone:{
        type:String,
        default:"",
    },
    address:{
        type:String,
        default:"",
    },
    medicalconditions:{
        type:String,
        default:"",
    },
    allergies:{
        type: String,
        default:"",
    },
    medications:{
        type:String,
        default:"",
    },
    bloodgrp:{
        type:String,
        default:"",
    },
    lastlocation:{
        type:String,
        default:"",
    },

emergencycontacts: {
  type: [emergencyContactSchema],
  default: []
}



});

export default mongoose.model("user",userschema);