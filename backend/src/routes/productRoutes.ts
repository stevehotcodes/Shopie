import { Router } from "express";
import { createNewProduct, deleteProduct, getAProduct, getProducts, updateProduct } from "../controllers/productControllers";
import { adminPrivilege } from "../middlewares/verifyTokens";




const productRouter=Router();

productRouter.post("/new",adminPrivilege,createNewProduct)
productRouter.get("/all",getProducts)
productRouter.get("/category/:category",getProducts);
productRouter.get("/one/:id",getAProduct)
productRouter.patch("/:id",adminPrivilege,updateProduct)
productRouter.delete("/:id",adminPrivilege,deleteProduct)





export default productRouter