import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { LoginComponent } from './login/login.component';
import { NewproductComponent } from './newproduct/newproduct.component';
import { ProductsComponent } from './products/products.component';
import { RegistrationComponent } from './registration/registration.component';
import { CustomersComponent } from './customers/customers.component';
import { AdminlandingComponent } from './adminlanding/adminlanding.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { OrdersComponent } from './orders/orders.component';
import { ProfileComponent } from './profile/profile.component';
import { UserdashboardComponent } from './userdashboard/userdashboard.component';
import { UserGuard } from './guards/user.guard';
import { DeactivateGuard } from './guards/deActivated.guard';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  { path: '', component: LandingpageComponent },
  { path: 'login', component: LoginComponent,canActivate:[DeactivateGuard]},
  { path: 'admin', component: AdminlandingComponent ,canActivate:[UserGuard]},
  { path: 'user', component: UserdashboardComponent ,canActivate:[UserGuard]},
  { path: 'add', component: NewproductComponent ,canActivate:[UserGuard]},
  
  { path: 'products', component: ProductsComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'customers', component: CustomersComponent },
  {path:'cart',component:CartComponent},

  {path: 'orders', component: OrdersComponent,canActivate:[UserGuard] },
  {path:'uorders',component:UserOrdersComponent,canActivate:[UserGuard]},
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: UserdashboardComponent ,canActivate:[UserGuard]},
  { path: 'productlists', component: ProductlistComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
