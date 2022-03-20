import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart/cart.service';
import { SessionService } from 'src/app/services/session/session.service';
import { faArrowRight,faPlus,faMinus } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  @Input() product!:Product;
  productCount:number = 0;

  faArrowRight = faArrowRight;
  faPlus = faPlus;
  faMinus = faMinus;
  constructor(private cartService:CartService, private sessionService:SessionService) { }

  ngOnInit(): void {
    this.getHowManyOfThisProductsHasBeenAddedToCart();
  }

  addItemToCart(product:Product){
    //this.cartService.addItemToCart(product);

/*     this.cartService.getCart().subscribe(cart=>{
      console.log(cart);
    }); */
    this.cartService.addItemToCart(this.product.id).subscribe(()=>{
      this.getHowManyOfThisProductsHasBeenAddedToCart();
    });
  }
  removeItemFromCart(product:Product){
    //this.cartService.removeItemFromCart(product.id);
    this.cartService.removeItemFromCart(this.product.id).subscribe(()=>{
      this.getHowManyOfThisProductsHasBeenAddedToCart();
    });
    
  }

  getHowManyOfThisProductsHasBeenAddedToCart(){
    return this.cartService.getCart().subscribe(cartReference=>{
      let cart = cartReference.cart;
      cart.forEach(cartItem=>{
        if(this.product.id == cartItem.product_id){
          this.productCount = cartItem.count | 0;
        }
      })
    });
  }
}
