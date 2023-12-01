import { Request, RequestHandler, Response } from "express";
import { registerUserSchema } from "../validators/validators";
import Connection from "../dbhelpers/dbhelpers";
import { isEmpty } from "lodash";
import { v4 } from "uuid";
import bcrypt from "bcrypt";
import mssql from "mssql";
import { dbConfig } from "../config/dbConfig";
import jwt from "jsonwebtoken";
import { IUserDetails, User } from "../interfaces/userInterface";
import { ExtendedUser } from "../middlewares/verifyTokens";
import ejs from "ejs";
import securePassword from'secure-random-password'
import dbhelper from '../dbhelpers/dbhelpers'


const baseUrl="http://localhost:3000"

const APPHOST = process.env.APPHOST || 'http://localhost'
const PORT = process.env.PORT || 3000

// const dbhelper = new Connection();

export const registerUser = async (req: Request, res: Response) => {
  try {
    let { firstname, lastname, email, password } = req.body;

    let { error } = registerUserSchema.validate(req.body);

    if (error) {
      return res.status(404).json({ error: error.details });
    }
    const emailTaken = (
      await dbhelper.query(`SELECT * FROM users where email = '${email}'`)
    ).recordset;

    if (!isEmpty(emailTaken)) {
      return res.json({ error: "This email is already in use" });
    }

    let id = v4();
    const hashedPwd = await bcrypt.hash(password, 5);

    let result = dbhelper.execute("userRegistration", {
      id,
      firstname,
      lastname,
      email,
      password: hashedPwd,
    });
    console.log(result);
    if((await result).rowsAffected[0] === 0){
      return res.status(404).json({
          message: "Something went wrong, employee not registered"
      })
  }else{
      return res.status(201).json({
          message: "User registered successfully"
      })
  }

    return res.status(200).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const pool = await mssql.connect(dbConfig);
    let user = (await pool
      .request()
      .input("email", email)
      .input("password", password)
      .execute("loginUser")
      )
     console.log(user)

    if (!user.recordset.length) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const { password: storedPassword, ...rest } = user.recordset[0];
    console.log(rest)
    const correctPwd = await bcrypt.compare(password, storedPassword);
    if (!correctPwd) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(rest, process.env.SECRET_KEY as string, {
      expiresIn: "34000s",
    });
    console.log(token);

    return res.status(200).json({ message: "LogIn successful", token,email,role:rest.role});
  } catch (error:any) {
    console.error(error);
    return res.status(500).json({ error: error.message});
  }
};

export const getAllUsers =async(req:Request,res:Response)=>{
  try {
         let users:IUserDetails[]=(await dbhelper.execute('getAllUsers')).recordset
         if(!users){
            return res.status(404).json({message:"No customers found"});
         }   
         

         return res.status(200).json(users) 
  } catch (error:any) {
      return res.status(500).json({error:error.message})
    
  }
}

export const getAUserById =async(req:ExtendedUser,res:Response)=>{
  try {
        const {id}=req.params
         let user:IUserDetails=(await dbhelper.execute('getAUserById',{id})).recordset[0]
         if(!user){
            return res.status(404).json({message:"No customer found"});
         }   
         
         return res.status(200).json(user) 
  } catch (error:any) {
      return res.status(500).json({error:error.message})
    
  }
}

export const getSignedInUser =async(req:ExtendedUser,res:Response)=>{
  try {
        const id=req.info?.id! as string
         let user:IUserDetails=(await dbhelper.execute('getAUserById',{id})).recordset[0]
         if(!user){
            return res.status(404).json({message:"No customer found"});
         }   
         
         return res.status(200).json(user) 
  } catch (error:any) {
      return res.status(500).json({error:error.message})
    
  }
}



export const updateUser =async (req:ExtendedUser,res:Response)=>{
  try{
      let id=req.info?.id! as string
      let { firstname, lastname, email, password }=req.body
      if(!firstname||!lastname ||!email||!password ){
          return res.status(400).json({message: 'required values are missing kindly check again'})
      }
      let user:User= await (await dbhelper.execute('getAUserById', {id})).recordset[0]
      if(!user){
          return res.status(404).json({message: 'The user does not exist'});

       }
      const hashedPassword=await bcrypt.hash(password, 5);

      await dbhelper.execute('updateUser',{id,firstname, lastname, email, password:hashedPassword})
      return res.status(200).json({message:"the user's details was updated successfully "})

  }
  catch(error:any){
          return res.status(500).json({message:error.message})
  }
}










// export const forgotPassword:RequestHandler = async (req, res) => {
//   // sends an email to the user to reset password
//   try {

//       let link =  APPHOST + ':' + PORT + '/users/reset-password'
//       const {email} = req.query as {email:string}
//       if (!email) {
//           return res.status(400).json({message: 'provide an email in the query'})
//       }
//       const user = await getUser('email', email)
//       if (user) {
//           const newPassword = securePassword.randomPassword({
//               length:12,
//               characters: [
//                   securePassword.upper,
//                   securePassword.lower,
//                   securePassword.symbols,
//                   securePassword.digits
//               ]
//           })

//           const token = jwt.sign({id:user.id,password:newPassword}, process.env.SECRET_KEY as string, {expiresIn:'300s'})
//           link = link+'?reset='+token
//           await ejs.renderFile(path.resolve(__dirname, '../../templates/reset-password-email.ejs'), {firstName:user.firstname, newPassword, link}, async (err, emailHTML)=>{
//               if (err) {
//                   console.error(err)
//                   return false
//               }
//               const mailer = NodeMail.getInstance()
//               await mailer.send(user.email, 'Password Reset Link', emailHTML)
//               return true
//           })
//       }
//       return res.status(200).json({message: `If a user exists with email: <${email}> a reset link will be sent to the email provided. Check spam folder in case you don't see any email.`})
//   }
//   catch (error:any) {
//       return res.status(500).json({message: error.message})
//   }
// }








// export const resetPassword =async(req:ExtendedUser,res:Response)=>{
//   try{

//      const {reset}=req.query



//   }
//   catch(error:any){

//   }
// }