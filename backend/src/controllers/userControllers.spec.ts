import mssql from 'mssql'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {v4} from 'uuid'
import{Request,Response}from 'express'
import dbhelper from '../dbhelpers/dbhelpers'
import { loginUser, registerUser } from './userControllers'

jest.mock("../dbhelpers/dbhelpers")




  describe('User Controller Tests', () => {
    let res:any 
  
    beforeEach(() => {
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } 
      // jest.clearAllMocks();
    });
  
    it('successfully registers a user', async () => {
      const req = {
        body: {
          firstname: 'Daniel',
          lastname: 'Kitheka',
          email: 'ondiekistephen00@gmail.com',
          password: 'hashpassword@123',
        },
      };
  
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashpassword@123' as never);
      ((dbhelper.execute as jest.Mock)).mockResolvedValueOnce({
        rowsAffected: [1],
      
        
      });
  
      await registerUser(req as Request, res as any);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({"message": "User registered successfully"})
      
     
  
    });
  });

  describe ("Testing Login Functionality", ()=>{

    let res:any

    beforeEach(()=>{
        res={
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }
    })

 
  

    it("Returns an error if email is not in database", async()=>{
        const req = {
            body:{
                email: "incorrect@email.com",
                password: "12345678"
            } 
        }

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({recordset: []})
        } as never)
 
        await loginUser(req as Request, res)

        expect(res.json).toHaveBeenCalledWith({error: "Invalid credentials"}) 
    })

    it("Handles incorrect password scenario", async()=>{
        const req = {
            body:{
                email: "correct@email.com",
                password: "wrongPassword"
            }
        }

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                recordset: [{
                    email: 'correct@email.com',
                    password: 'hashedPwd'
                }]
            })
        } as never)

        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never)

        await loginUser(req as Request, res)

        expect(res.json).toHaveBeenCalledWith({error: "Invalid credentials"})
    })

    it("successfully logs in a user and returns a token", async()=>{

        let expectedUser = {
            id: "0adbb3b5-dead-448f-9ca1-44f93d0e5527",
            firstname: "Jane Doe",
            lastname:"stephan",
            email: "correct@email.com",
            password: "$2b$05$S.fpxBj3qNllnIvd.sq/beDjNoP72TvaMAS.GrplxY75sFyh6qV7e",
            role: "employee",
            isWelcomed: 0,
            isDeleted:0
        }

        const req = {
            body:{
                email: expectedUser.email,
                password: "correctPassword"
            }
        }

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({recordset: [expectedUser]})
        } as never)

        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never)

        jest.spyOn(jwt, 'sign').mockReturnValueOnce("generate-token-jghjg-jyiugjxz-mmhjruyiu" as never)

        await loginUser(req as Request, res)

        expect(res.json).toHaveBeenCalledWith({
          
            token: "generate-token-jghjg-jyiugjxz-mmhjruyiu",
            email: "correct@email.com",
            message: "LogIn successful",
            role:"employee"
               
            
        }) 
    }) 
}) 