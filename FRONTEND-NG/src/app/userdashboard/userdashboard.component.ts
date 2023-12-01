import { Component } from '@angular/core';
import { IorderDetailsWithUserInfo, OrdersService } from '../services/orders.service';
import { ProductsService } from '../services/products.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css'],
})
export class UserdashboardComponent {
  showModal = false;
  selectedProduct: any;

  orders: IorderDetailsWithUserInfo[] = [];
  products: any[] = [];
  constructor(
    private orderSvc: OrdersService,
    private productSvc: ProductsService,
    private cartSvc: CartService
  ) {}

  ngOnInit() {
    this.getAllOrders();
    this.getAllProducts();
  }

  openModal(product: any) {
    this.selectedProduct = product;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedProduct = null;
  }

  getAllOrders() {
    this.orderSvc.getOrdersByUser().subscribe((res) => {
      console.log(res);
      this.orders = res;
      console.log(this.orders);
    });
  }

  getAllProducts() {
    this.productSvc.getAllProducts().subscribe((res) => {
      console.log('all products', res);
      this.products = res;
    });
  }
  addToCart(id: string) {
    this.cartSvc.addItem(id).subscribe((res) => {
      console.log(id);

      console.log('res fronm service', res);
    });
    console.log('item added to  works');
  }
}
