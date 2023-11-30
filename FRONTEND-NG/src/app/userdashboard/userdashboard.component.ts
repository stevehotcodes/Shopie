import { Component } from '@angular/core';
import { IorderDetailsWithUserInfo, OrdersService } from '../services/orders.service';
import { ProductsService } from '../services/products.service';
import { CartService } from '../services/cart.service';
import { FlashmessagesService } from '../services/flashmessages.service';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent {


  orders:IorderDetailsWithUserInfo[]=[]
  products:any[]=[]
  constructor(private orderSvc:OrdersService, private productSvc:ProductsService,private cartSvc:CartService,private flashMsgSvc:FlashmessagesService){}

  ngOnInit(){
      this.getAllOrders()
      this.getAllProducts()
  }
      

  getAllOrders(){
    this.orderSvc.getOrdersByUser().subscribe(
      res=>{
        console.log(res)
        this.orders=res
        console.log(this.orders)
      }
    )
  }

  getAllProducts(){
    this.productSvc.getAllProducts().subscribe(
      res=>{
        console.log("all products",res)
        this.products=res
      }
    )
  }
  addToCart(id:string){
   
    this.cartSvc.addItem(id).subscribe(
      (res:any)=>{
        console.log(id);
        
        console.log("res fronm service",res);
        this.flashMsgSvc.pushMessage({
          type:'success',
          message:res.message
        })
          
        
      }
    )
    console.log("item added to  works");
    
  }

}
