import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductCategory } from 'src/app/models/product-category';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy{

  products:Product[] = [];
  productCategories:ProductCategory[] = [];

  getProductsSubscription:Subscription | null =null;
  getProductCategoriesSubscription:Subscription | null =null;

  filter='';
  selectedCategory=1;
  
  constructor(private productService:ProductService, private cartService:CartService) { }

  ngOnInit(): void {
    //Load products on load
    this.getCoffees();
    this.getCategories();
  }


  ngOnDestroy(): void {
    if(this.getProductsSubscription != null){
      this.getProductsSubscription.unsubscribe();
    }  
    if(this.getProductCategoriesSubscription != null){
      this.getProductCategoriesSubscription.unsubscribe();
    }  
  }

  //Get coffees and remove subscription after that.
  getCoffees(){
    this.getProductsSubscription = this.productService.getProducts(this.filter,this.selectedCategory).subscribe(products=>{
      this.products = products || [];
    });

    
  }

  //Get product categories
  getCategories(){
    this.getProductCategoriesSubscription = this.productService.getProductCategories().subscribe(categories=>{
      this.productCategories = categories;
    })
  }

  //Refresh products when the cart is closed.
  onCartClosedHandler(e:any){
    this.getCoffees();
  }
}
