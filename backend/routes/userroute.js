import express from 'express';
import {adduserdetails, deletecontact, logout, register, updateEmergencyContacts} from '../controllers/usercontroller.js';
import { login } from '../controllers/usercontroller.js';
import authenticateuser from '../middlewares/authenticateuser.js';
import { getuserdetails } from '../controllers/usercontroller.js';
const router=express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/logout",logout);
router.get("/user",authenticateuser,getuserdetails);
// available only becoz i did req.user = user in middleware//can be accessed in getuserdetails func also!!!
router.post("/updateuserdetails",authenticateuser,adduserdetails);
router.post("/emergencycontacts",authenticateuser,updateEmergencyContacts);
router.delete("/deletecontact/:id",authenticateuser,deletecontact);
export default router;