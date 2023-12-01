import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import {
//   getAllProductDetails,
//   productDetails,
// } from '../interfaces/productInterface';
import { Observable } from 'rxjs';
import { getAllProductDetails } from '../interfaces/productInterface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'http://localhost:3000/products/new';

  constructor(private http: HttpClient) {}

  addProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  getAllProducts(): Observable<any> {
    return this.http.get<any>(
      'http://localhost:3000/products/all'
    );
  }
  getProductByID(id: string): Observable<any> {
    return this.http.get<getAllProductDetails[]>(
      `http://localhost:3000/products/one/${id}`
    );
  }
  updateProduct(id: string, updatedProductData: any): Observable<any> {
    return this.http.put(
      `http://localhost:3000/products/${id}`,
     { updatedProductData}
    );
  }
}
