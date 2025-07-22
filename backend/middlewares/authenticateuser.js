import jwt from 'jsonwebtoken';

const authenticateuser=(req,res,next)=>{
    const header=req.headers['authorization'];
    const token= header && header.split(' ')[1];

    if(!token) return res.json({message:"No token found!"});

    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return res.json({message:"Invalid token!"});
//the user is just the data which was put into token while loggin in
        else req.user=user; //used req.user so that next routes can access them dirwectly, check userroute, the func next after this will have access to req.user, and can access every info of new user from the tokem//
        next();
    });
};

export default authenticateuser;