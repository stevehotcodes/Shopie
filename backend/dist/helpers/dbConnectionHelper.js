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
const mssql_1 = __importDefault(require("mssql"));
const dbConfig_1 = require("../config/dbConfig");
class DatabaseHelper {
    constructor() {
        this.pool = mssql_1.default.connect(dbConfig_1.dbConfig);
    }
    static getInstance() {
        if (!DatabaseHelper.instance) {
            DatabaseHelper.instance = new DatabaseHelper();
        }
        return DatabaseHelper.instance;
    }
    static addInputsToRequest(request, data = {}) {
        const keys = Object.keys(data);
        keys.map(keyName => {
            return request.input(keyName, data[keyName]);
        });
        return request;
    }
    exec(storedProcedure, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let request = yield (yield this.pool).request();
            request = DatabaseHelper.addInputsToRequest(request, data);
            return yield request.execute(storedProcedure);
        });
    }
    query(queryString) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.pool).request().query(queryString);
        });
    }
}
exports.default = DatabaseHelper;
//# sourceMappingURL=dbConnectionHelper.js.map