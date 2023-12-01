import mssql from "mssql";
import { dbConfig } from "../config/dbConfig";

export default class Connection {
  // private pool: Promise<mssql.ConnectionPool>;
  // //   getConnection: any;
  // constructor() {
  //   this.pool = this.getConnection();
  // }
  // async getConnection(): Promise<mssql.ConnectionPool> {
  //   const pool = mssql.connect(dbConfig) as Promise<mssql.ConnectionPool>;
  //   return pool;
  // }
  // createRequest(
  //   request: mssql.Request,
  //   data: { [c: string | number]: string | number }
  // ) {
  //   const keys = Object.keys(data);

  //   keys.map((keyName) => {
  //     const keyValue = data[keyName];
  //     request.input(keyName, keyValue);
  //   });
  //   return request;
  // }

  static async query(query: string) {
    const pool = mssql.connect(dbConfig) as Promise<mssql.ConnectionPool>
    const results = (await pool).request().query(query)
       return results;
  }

  static async execute(procedureName: string,data: { [c: string | number]: string | number } = {}  ) {
    const pool = mssql.connect(dbConfig) as Promise<mssql.ConnectionPool>;
    let request = ((await pool).request()) as mssql.Request;
    // request = this.createRequest(request, data);

    for(let key in data){
      request.input(key, data[key])
       }
    const result = await request.execute(procedureName);
    return result;
  }
}
