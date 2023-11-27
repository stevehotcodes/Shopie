import { Request, Response } from "express";
import { registerUserSchema } from "../validators/validators";
import Connection from "../dbhelpers/dbhelpers";
import { isEmpty } from "lodash";
import { v4 } from "uuid";
import bcrypt from "bcrypt";
import mssql from "mssql";
import { dbConfig } from "../config/dbConfig";
import jwt from "jsonwebtoken";
import { IUserDetails } from "../interfaces/userInterface";

const dbhelper = new Connection();

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
    let user = await pool
      .request()
      .input("email", email)
      .input("password", password)
      .execute("loginUser");

    if (!user.recordset.length) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const { password: storedPassword, ...rest } = user.recordset[0];
    const correctPwd = await bcrypt.compare(password, storedPassword);
    if (!correctPwd) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(rest, process.env.SECRET_KEY as string, {
      expiresIn: "34000s",
    });
    console.log(token);

    return res.status(200).json({ message: "LogIn successful", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "server error" });
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

export const getAUserById =async(req:Request,res:Response)=>{
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