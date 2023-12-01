import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http:HttpClient) { }
  // cartRouter.post('',accountRequired,addItem)
  addItem(productID:string){
    return this.http.post(`http://localhost:3000/cart`,{productID})

  }


  getCart(){
    return this.http.get('http://localhost:3000/cart')
  }
  removeItem(itemID:string){
    return this.http.delete(`http://localhost:3000/cart/${itemID}`)
  }

  createANewOrder(){
    return this.http.post(`http://localhost:3000/order/new`,{})
  }
}

// orderRouter.post('/new',accountRequired,createAnOrder)