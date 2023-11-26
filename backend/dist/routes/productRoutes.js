"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productControllers_1 = require("../controllers/productControllers");
const productRouter = (0, express_1.Router)();
productRouter.post("/new", productControllers_1.createNewProduct);
productRouter.get("/all", productControllers_1.getProducts);
productRouter.get("/category/:category", productControllers_1.getProducts);
productRouter.get("/one/:id", productControllers_1.getAProduct);
productRouter.put("/:id", productControllers_1.updateProduct);
productRouter.delete("/:id", productControllers_1.deleteProduct);
exports.default = productRouter;