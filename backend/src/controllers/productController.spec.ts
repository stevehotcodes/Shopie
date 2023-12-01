import mssql from 'mssql'
import bcrypt from 'bcrypt'

import {v4} from 'uuid'
import{Request,Response}from 'express'
import dbhelper from '../dbhelpers/dbhelpers'
import { createNewProduct, getAProduct, getProducts } from './productControllers'

jest.mock("../dbhelpers/dbhelpers")

describe(' Tests for adding a product',()=>{
    let res:Partial<Response> 

    beforeEach(() => {
        res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        } as any;
        jest.clearAllMocks();
      });

    it('can add a product',async ()=>{
        // let {productName,productDescription,price,productImageURL,category,productStock}=req.body
        const req={
            body:{
                productName:'Amplifier',
                productDescription:'Black in color',
                price:4000,
                productImageURL:'https://images.pexels.com/photos/339379/pexels-photo-339379.jpeg?auto=compress&cs=tinysrgb&w=600',
                category:'Electronics',
                productStock:60
            }
        };

        ((dbhelper.execute as jest.Mock)).mockResolvedValueOnce({
            rowsAffected: [1],
            
          });

            await createNewProduct(req as Request, res as Response)
          //return res.status(201).json({message:"product created successfully"})
          expect(res.status).toHaveBeenCalledWith(201)
          expect(res.json).toHaveBeenCalledWith({"message":"product created successfully"})

    })

})

describe('getting products functionality',()=>{
  
let res:any
let req:Partial<Request>
    

    beforeEach(()=>{
        
         res={
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any
    })

    it('should return products when category is provided',async ()=>{
        req={ params:{}},
        ((dbhelper.execute as jest.Mock)).mockResolvedValueOnce({
            recordset: [
                {
                    id: "f90194d0-5120-43e0-8fc8-db4b96ef1ecc",
                    "productName": "iPHONE",
                    "productDescription": "White",
                    "price": 100000,
                    "productImageURL": "https://www.pexels.com/photo/silver-iphone-x-with-airpods-788946/",
                    "category": "Electronics",
                    "productStock": 12,
                    "isDeleted": 0
                  },
                  {
                    "id": "ff1903fe-ccf6-4952-a6e3-2f331016bebf",
                    "productName": "iPHONE",
                    "productDescription": "White",
                    "price": 100000,
                    "productImageURL": "https://www.pexels.com/photo/silver-iphone-x-with-airpods-788946/",
                    "category": "Electronics",
                    "productStock": 12,
                    "isDeleted": 0
                  }
            ],
          });
          req.params!.category = 'someCategory';
        await getProducts(req as  Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith( [
            {
                "id": "f90194d0-5120-43e0-8fc8-db4b96ef1ecc",
                "productName": "iPHONE",
                "productDescription": "White",
                "price": 100000,
                "productImageURL": "https://www.pexels.com/photo/silver-iphone-x-with-airpods-788946/",
                "category": "Electronics",
                "productStock": 12,
                "isDeleted": 0
              },
              {
                "id": "ff1903fe-ccf6-4952-a6e3-2f331016bebf",
                "productName": "iPHONE",
                "productDescription": "White",
                "price": 100000,
                "productImageURL": "https://www.pexels.com/photo/silver-iphone-x-with-airpods-788946/",
                "category": "Electronics",
                "productStock": 12,
                "isDeleted": 0
              }
        ],)
        
      
    })

    it('should fetch a product by id or get one product',async()=>{
        // let req:Partial<Request>
         req={params:{id:'55087810-a12c-49eb-9f4a-44e09224f664'} };
         
        ((dbhelper.execute as jest.Mock)).mockResolvedValueOnce(
            [
            {
                id: "55087810-a12c-49eb-9f4a-44e09224f664",
                 productName: "iPHONE",
                 productDescription: "White",
                 price: 100000,
                 productImageURL: "https://www.pexels.com/photo/silver-iphone-x-with-airpods-788946/",
                 category: "Electronics",
                 productStock: 12,
                 isDeleted: 0
                 
            }]
          )

          await getAProduct(req as Request,res as any)
          expect (res.json).toHaveBeenCalledWith({
            
            id: "55087810-a12c-49eb-9f4a-44e09224f664",
            productName: "iPHONE",
            productDescription: "White",
            price: 100000,
            productImageURL: "https://www.pexels.com/photo/silver-iphone-x-with-airpods-788946/",
            category: "Electronics",
            productStock: 12,
            isDeleted: 0
          })


    })

})
