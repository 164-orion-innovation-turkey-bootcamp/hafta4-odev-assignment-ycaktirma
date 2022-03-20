import { Component, ElementRef, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { faShoppingCart,faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartToggle:boolean=false;
  cartSubscription:Subscription | null = null;
  cart:any;
  totalPrice:number = 0;
  faCoffee = faShoppingCart;
  faClose = faClose;
  @Output() onCartClosed: EventEmitter<void> = new EventEmitter<void>();

  constructor(private cartService:CartService) { }

  ngOnInit(): void {
  }

  toggleCartPanel(){    
    this.cartToggle = !this.cartToggle;
  }

  openCartPanel(){
    this.toggleCartPanel();
    this.getCart();
    this.getTotalPrice();
  }

  closeCartPanel(){
    this.toggleCartPanel();
    this.cartSubscription?.unsubscribe();
    this.onCartClosed.emit();
  }

  getTotalPrice(){
    this.cartService.getTotalPriceOfTheCart().subscribe(total=>{
      this.totalPrice = total;
    });
  }

  buy(){
    this.cartService.buy().subscribe(success=>{
      this.totalPrice = 0;
      this.closeCartPanel();
      this.getCart();
    });
  }

  getCart(){
    console.log("cart çekiliyor");
    this.cartService.getCartWithProductNames().subscribe((cart: { cart: any; })=>{
      console.log("Cart",cart);
      this.cart = cart;
    })
  }

}
