import {v4} from 'uuid';
import { Request,Response, response } from 'express';
import { IProduct } from '../interfaces/productInterface'
import { IpOptions } from 'joi';
import dbhelper from '../dbhelpers/dbhelpers';


// const db=new Connection()


export const createNewProduct=async (req:Request,res:Response)=>{
    try {

        let id=v4();
        let {productName,productDescription,price,productImageURL,category,productStock}=req.body
        if(!productName||!productDescription ||!price||!productImageURL ||!category ||!productStock){
            return res.status(400).json({message: 'missing all or either productName, productDescription, price,productImage,category,productstock'})
        }

        let result=await (await dbhelper.execute("createNewProduct",{id,productName,productDescription,price,productImageURL,category,productStock})).rowsAffected
        
        console.log(result)

        return res.status(201).json({message:"product created successfully"})


        
    } catch (error:any) {
        
        console.log(error)
        return res.status(500).json({message:"error in creating the product",error:error})
    }
}

export const getProducts=async (req:Request,res:Response)=>{
    try {

         let {category}=req.params

         let products:IProduct[]=category?(await dbhelper.execute("getProductsByCategory",{category})).recordset:(await dbhelper.execute('getAllProducts')).recordset

         if(!products.length){
            return res.status(404).json({message: 'No products found'})

         }
        return res.status(200).json(products)

        
    } catch (error:any) {
         return res.status(500).json({message: error.message})
    }
}
export const getAProduct =async (req:Request,res:Response)=>{
    try{
        let {id}=req.params

         let products:IProduct=(await dbhelper.execute("getProductById",{id})).recordset[0]

         if(!products){
            return res.status(404).json({message: 'No product found'})
          }
          return res.status(200).json(products)
        }

    catch(error:any){
        return res.status(500).json({message: error.message})
    }
}

export const updateProduct =async (req:Request,res:Response)=>{
    try{
        let {id}=req.params
        let {productName,productDescription,price,productImageURL,category,productStock}=req.body
        // if(!productName||!productDescription ||!price||!productImageUrl ||!category ||!productStock){
        //     return res.status(400).json({message: 'missing all or either productName, productDescription, price,productImage,category,productstock'})
        // }
        let product:IProduct= await (await dbhelper.execute('getProductById', {id})).recordset[0]
        console.log(req.body)
        if(!product){
            return res.status(404).json({message: 'The product does not exist'});

         }

        await dbhelper.execute('updateProduct',{id,productName,productDescription,price,productImageURL,category,productStock})
        return res.status(200).json({message:"the product's details was updated successfully "})

    }
    catch(error:any){
            return res.status(500).json({message:error.message})
    }
}

export const deleteProduct=async (req:Request,res:Response)=>{
    try {
        let {id}=req.params

        let product:IProduct=(await dbhelper.execute("getProductById",{id})).recordset[0]

        if(!product){
           return res.status(404).json({message: 'No product found'})
         }
         await (await dbhelper.execute('deleteProduct', {id})).recordset
         return res.status(200).json({message:"item deleted successfully"})
       

    } catch (error:any) {
        return res.status(500).json({message: error.message})
    }
}

//search  feature

// export const searchProduct =async(req:Request,res:Response)=>{
//     try {
//         let searchTerm=req.query.q

//         if(!searchTerm){
//             res.status(400).json({message:"no search query was provided"});

//         }
//         let searchResult:IProduct[]=(await db.query(`SELECT * FROM products WHERE productName LIKE '%${searchTerm}'`)).recordset;
//         if(!searchResult.length){
//             res.status(404).json({message:"no results found"})
//         }

//         return res.status(200).json(searchResult)


//     } catch (error:any) {
//         return res.status(500).json({error:error.message})
        
//     }
// }

