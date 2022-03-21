import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  addProductToCartSubscription:Subscription | null = null;
  removeProductToCartSubscription:Subscription | null = null;
  getCartProductCountSubscription:Subscription | null = null;

  productCount:number = 0;

  addCommentForm:FormGroup | any;

  constructor(private productService:ProductService, private activatedRoute:ActivatedRoute,private cartService:CartService,private formBuilder:FormBuilder, private router:Router) { }

  //Get product details on init, if not found, navigate to /shop
  ngOnInit(): void {
    this.getProductSubscription = this.getProductDetails().subscribe(product=>{
      if(product == null){
        this.router.navigateByUrl('/shop');
        return;
      }
      this.product = (product as Product);

      this.getHowManyOfThisProductsHasBeenAddedToCart();
      
      this.getProductCommentsSubscription = this.productService.getProductComments(this.product.id).subscribe(comments=>{
        this.comments = comments;
      });
    })

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
    if(this.addProductToCartSubscription != null){
      this.addProductToCartSubscription.unsubscribe();
    }
    if(this.removeProductToCartSubscription != null){
      this.removeProductToCartSubscription.unsubscribe();
    }
    if(this.getCartProductCountSubscription != null){
      this.getCartProductCountSubscription.unsubscribe();
    }
  }

  //Creates add comment form.
  createAddCommentForm(){
    this.addCommentForm = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.maxLength(50)]]
    })
  }

  //addCommentForm handler
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

  //shop/product/x take x and get details of product x
  getProductDetails(){
    return this.activatedRoute.paramMap.pipe(switchMap(params=>{
      let id = Number(params.get('id'));
      return this.productService.getProductById(id);
    }))
  }

  //Adds item to cart and 
  addItemToCart(product:Product){

    if(this.addProductToCartSubscription != null){
      this.addProductToCartSubscription.unsubscribe();
    }

    if(this.product != null){
      this.cartService.addItemToCart(this.product.id).subscribe(()=>{
        this.getCartProductCountSubscription = this.getHowManyOfThisProductsHasBeenAddedToCart();
      });
    }
  }

  //Removes item from the cart
  removeItemFromCart(product:Product){

    if(this.removeProductToCartSubscription != null){
      this.removeProductToCartSubscription.unsubscribe();
    }


    if(this.product != null){
      this.removeProductToCartSubscription = this.cartService.removeItemFromCart(this.product.id).subscribe(()=>{
        this.getCartProductCountSubscription = this.getHowManyOfThisProductsHasBeenAddedToCart();
      });
    }
    
  }

  //Returns the count of the product count.
  getHowManyOfThisProductsHasBeenAddedToCart(){
    return this.cartService.getCart().subscribe(cartReference=>{

      let cart = cartReference.cart;
      if(!(cart.length == 0)){
        cart.forEach(cartItem=>{
          if((this.product as Product).id == cartItem.product_id){
            this.productCount = cartItem.count;
          }
        })        
      }else{
        this.productCount = 0;
      }

    });
  }

  //Refresh product count
  onCartClosedHandler(e:any){
    this.getCartProductCountSubscription =  this.getHowManyOfThisProductsHasBeenAddedToCart();
  }

}
