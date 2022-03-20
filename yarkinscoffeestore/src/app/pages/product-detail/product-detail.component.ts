import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {

  product:Product | null = null;
  comments: any[] = [];

  getProductSubscription:Subscription | null = null;
  getProductCommentsSubscription:Subscription | null = null;
  addCommentSubscription:Subscription | null = null;
  productCount:number = 0;

  addCommentForm:FormGroup | any;

  constructor(private productService:ProductService, private activatedRoute:ActivatedRoute,private cartService:CartService,private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.getProductSubscription = this.getProductDetails().subscribe(product=>{
      this.product = (product as Product);
      this.getProductCommentsSubscription = this.productService.getProductComments(this.product.id).subscribe(comments=>{
        console.log("comments",comments);
        this.comments = comments;
      });
    })

    this.getHowManyOfThisProductsHasBeenAddedToCart();
    this.createAddCommentForm();
  }


  //Remove subscriptions on destroy
  ngOnDestroy(): void {
    if(this.getProductSubscription != null){
      this.getProductSubscription.unsubscribe(); 
    }

    if(this.getProductCommentsSubscription != null){
      this.getProductCommentsSubscription.unsubscribe();
    }
    if(this.addCommentSubscription != null){
      this.addCommentSubscription.unsubscribe();
    }
  }

  createAddCommentForm(){
    this.addCommentForm = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.maxLength(50)]]
    })
  }

  onAddCommentFormSubmit(){
    if(this.product != null && this.addCommentForm.valid){
      this.addCommentSubscription = this.productService.addCommentToProduct(this.product.id,this.addCommentForm.get('comment').value).subscribe(()=>{
        this.addCommentForm.reset();
        this.getProductCommentsSubscription = this.productService.getProductComments((this.product as Product).id).subscribe(comments=>{
          this.comments = comments;
        });
      });
    }
  }

  getProductDetails(){
    return this.activatedRoute.paramMap.pipe(switchMap(params=>{
      let id = Number(params.get('id'));
      return this.productService.getProductById(id);
    }))
  }


  addItemToCart(product:Product){
    if(this.product != null){
      this.cartService.addItemToCart(this.product.id).subscribe(()=>{
        this.getHowManyOfThisProductsHasBeenAddedToCart();
      });
    }
    
  }
  removeItemFromCart(product:Product){
    if(this.product != null){
      this.cartService.removeItemFromCart(this.product.id).subscribe(()=>{
        this.getHowManyOfThisProductsHasBeenAddedToCart();
      });
    }
    
  }

  getHowManyOfThisProductsHasBeenAddedToCart(){
    return this.cartService.getCart().subscribe(cartReference=>{
      let cart = cartReference.cart;
      cart.forEach(cartItem=>{
        if((this.product as Product).id == cartItem.product_id){
          this.productCount = cartItem.count;
        }
      })
    });
  }

}
