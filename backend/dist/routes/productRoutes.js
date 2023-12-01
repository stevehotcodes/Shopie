"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productControllers_1 = require("../controllers/productControllers");
const verifyTokens_1 = require("../middlewares/verifyTokens");
const productRouter = (0, express_1.Router)();
productRouter.post("/new", verifyTokens_1.adminPrivilege, productControllers_1.createNewProduct);
productRouter.get("/all", productControllers_1.getProducts);
productRouter.get("/category/:category", productControllers_1.getProducts);
productRouter.get("/one/:id", productControllers_1.getAProduct);
productRouter.patch("/:id", verifyTokens_1.adminPrivilege, productControllers_1.updateProduct);
productRouter.delete("/:id", verifyTokens_1.adminPrivilege, productControllers_1.deleteProduct);
exports.default = productRouter;
//# sourceMappingURL=productRoutes.js.map