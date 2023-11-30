import { Request,Response } from "express";
import {v4} from "uuid"
import Connection from "../dbhelpers/dbhelpers";
import dotenv from 'dotenv'
import { ExtendedUser } from "../middlewares/verifyTokens";
import { IcartItem } from "../interfaces/cartInterface";


const databaseConnection= new Connection ()

export const getCart=async(req:ExtendedUser,res:Response)=>{
    try {
         const cart=(await databaseConnection.execute('getCart',{userID:req.info?.id!})).recordset
         if(!cart.length){
            return res.status(404).json({message:'your cart is empty'});
         }
         return res.status(200).json(cart)
        
    } catch (error:any) {
        return res.status(500).json({message:error.message})
    }
}

export const addItem=async (req:ExtendedUser,res:Response)=>{
    try{
        const userID=req.info?.id!
        const {productID}=req.body
        const cart=(await databaseConnection.execute('getCart',{userID:req.info?.id!})).recordset
        let cartItem:IcartItem=cart.filter((item)=>{return item.userID===userID&&item.productID===productID})[0]
        
        if(cartItem){
            await databaseConnection.execute('updateCartItemQuantity',{id:cartItem.id,quantity:cartItem.quantity+1})
            return res.status(200).json({message:"cart item quantity updated"})
        }
        else{
            const id=v4();  
            await databaseConnection.execute('addCartItem',{id,userID,productID})
            return res.status(201).json({message:"item added to cart"})
        }

    }
    catch(error:any){
        return res.status(500).json({message:error.message})
    }
}

export const deleteCartItem=async(req:ExtendedUser,res:Response)=>{
    try {
        const userID=req.info?.id!
        const {itemID}=req.params
        const cart=(await databaseConnection.execute('getCart',{userID})).recordset
        let cartItem:IcartItem=cart.filter((item:IcartItem)=>{
            console.log("itemID from params",itemID)
            console.log("item.id",item.id)
        
            return item.id==itemID

        }
            )[0]
        console.log(cartItem)
        // console.log("itemID from params",itemID)
        // console.log("cartItem.id",cartItem.id)
        
        if(cartItem){
            await databaseConnection.execute('deleteCartItem',{productID:cartItem.productID})
            console.log("hey I am deleted")
            return res.status(200).json({message:"cart item quantity deleted"})
        }
        else{
            return res.status(404).json({message:'item not in the cart'})
        }

    } catch (error:any) {
        return res.status(500).json({message:error.message})
        
    }
}

export  const clearCart=async (req:ExtendedUser,res:Response)=>{
    try {
          let userID=req.info?.id! 
          await databaseConnection.execute('clearCart',{userID})
          return res.status(200).json({message:"cart cleared"})
        
    } catch (error:any) {
        return res.status(500).json({error:error.message})
        
    }
}

export const updateCartItemQuantity=async(req:ExtendedUser,res:Response)=>{
    try{
        const userID=req.info?.id!
        const{quantity}=req.body
        const id=req.params.itemID
        const cart:IcartItem[]=(await databaseConnection.execute('getCart',{userID})).recordset
        let cartItem:IcartItem=cart.filter((item:IcartItem)=>{return item.productID==id})[0]

        if(cartItem){
            await databaseConnection.execute('updateCartItemQuantity',{id:cartItem.id,quantity})
            return res.status(200).json({message:'Cart Item Updated'})
        }
        else{
            return res.status(404).json({message:'Item not in the cart'})
        }

    }
    catch(error:any){
        return res.status(500).json({message:error.message})

    }
}
