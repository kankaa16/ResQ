import express from 'express';
import { sendsosmsg } from '../controllers/panicbtncontroller.js';
import authenticateuser from '../middlewares/authenticateuser.js';

const router=express.Router();

router.get("/sendmsg",authenticateuser,sendsosmsg);

export default router;