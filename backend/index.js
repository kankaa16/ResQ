import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectdb from './config/db.js';
import userroute from './routes/userroute.js';
import panicbtnroute from './routes/panicbtnroute.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", userroute);
app.use("/profile",userroute);
app.use("/sos",panicbtnroute);

app.listen(3000, () => {
  connectdb();
  console.log("server is running");
});
