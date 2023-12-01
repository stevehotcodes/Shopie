"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getAProduct = exports.getProducts = exports.createNewProduct = void 0;
const uuid_1 = require("uuid");
const dbhelpers_1 = __importDefault(require("../dbhelpers/dbhelpers"));
const createNewProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = (0, uuid_1.v4)();
        let { productName, productDescription, price, productImageURL, category, productStock } = req.body;
        if (!productName || !productDescription || !price || !productImageURL || !category || !productStock) {
            return res.status(400).json({ message: 'missing all or either productName, productDescription, price,productImage,category,productstock' });
        }
        let result = yield (yield dbhelpers_1.default.execute("createNewProduct", { id, productName, productDescription, price, productImageURL, category, productStock })).rowsAffected;
        console.log(result);
        return res.status(201).json({ message: "product created successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error in creating the product", error: error });
    }
});
exports.createNewProduct = createNewProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { category } = req.params;
        let products = category ? (yield dbhelpers_1.default.execute("getProductsByCategory", { category })).recordset : (yield dbhelpers_1.default.execute('getAllProducts')).recordset;
        if (!products.length) {
            return res.status(404).json({ message: 'No products found' });
        }
        return res.status(200).json(products);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getProducts = getProducts;
const getAProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        let products = (yield dbhelpers_1.default.execute("getProductById", { id })).recordset[0];
        if (!products) {
            return res.status(404).json({ message: 'No product found' });
        }
        return res.status(200).json(products);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getAProduct = getAProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        let { productName, productDescription, price, productImageURL, category, productStock } = req.body;
        let product = yield (yield dbhelpers_1.default.execute('getProductById', { id })).recordset[0];
        console.log(req.body);
        if (!product) {
            return res.status(404).json({ message: 'The product does not exist' });
        }
        yield dbhelpers_1.default.execute('updateProduct', { id, productName, productDescription, price, productImageURL, category, productStock });
        return res.status(200).json({ message: "the product's details was updated successfully " });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        let product = (yield dbhelpers_1.default.execute("getProductById", { id })).recordset[0];
        if (!product) {
            return res.status(404).json({ message: 'No product found' });
        }
        yield (yield dbhelpers_1.default.execute('deleteProduct', { id })).recordset;
        return res.status(200).json({ message: "item deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productControllers.js.map