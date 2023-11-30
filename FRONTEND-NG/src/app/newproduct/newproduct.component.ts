import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../services/products.service';
import { productDetails } from '../interfaces/productInterface';
import { FlashmessagesService } from '../services/flashmessages.service';

@Component({
  selector: 'app-newproduct',
  templateUrl: './newproduct.component.html',
  styleUrls: ['./newproduct.component.css'],
})
export class NewproductComponent {
  createProductForm!: FormGroup;
  buttonClicked: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private flashMsg:FlashmessagesService
  ) {
    this.createProductForm = formBuilder.group({
      productName: ['', [Validators.required]],
      productDescription: ['', [Validators.required]],
      price: ['', [Validators.required]],
      productImageURL: ['', [Validators.required]],
      productStock: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });
  }
  createProduct() {
    this.buttonClicked = true;

    if (this.createProductForm.valid) {
      let addedProduct: productDetails = this.createProductForm.value;
      console.log(this.createProductForm.value )

      this.productsService.addProduct(addedProduct).subscribe((res) => {
        console.log('product added', addedProduct,res);
        this.flashMsg.pushMessage({
          type:'success',
          message:res.message
        })
      },
      error=>{
        this.flashMsg.pushMessage({
          type:'error',
          message:error
        })
      });
    } else {
      console.log('invalid entry');
      this.flashMsg.pushMessage({
        type:'error',
        message:'invalid entry',
      })
    }
  }
}
