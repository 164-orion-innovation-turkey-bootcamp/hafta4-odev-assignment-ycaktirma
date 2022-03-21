import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product';
import { UserSession } from 'src/app/models/user-session';
import { environment } from 'src/environments/environment';
import { SessionService } from '../session/session.service';
import { Observable, map, switchMap, mergeMap,of, forkJoin, from } from 'rxjs';
import { ProductService } from '../product/product.service';
import { JsonServerLoggerService } from 'src/app/core/services/logger/json-server-logger.service';

/**
 * This service is responsible for cart operations, cart informations are stored on database.
 */

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartTableName='shoppingCart';
  private targetApiEndpoint = environment.baseApiUrl + this.cartTableName;

  constructor(private sessionService:SessionService,private http:HttpClient,private productService:ProductService, private jsonServerLogger:JsonServerLoggerService) { }

  //Initialize cart object. (This is used when new account registers)
  initializeUserCartOnDatabase(user_id:number){

    //Cart object
    let postData={
      user_id:user_id,
      cart:[]
    }
    return this.http.post(this.targetApiEndpoint,postData);
  }

  /**
   * Returns cart, Object:{id:number, user_id:number, cart:{product_id:number, count:number}[]}
   * @returns Observable<Object>
   */
  getCart():Observable<{id:number, user_id:number, cart:any[]}>{
    //Get id of the active user
    let activeUserId = this.sessionService.getIdOfLoggedInUser() as number;
    let queryParams = '?user_id='+activeUserId;

    //Send get request to get the cart of the user
    return this.http.get<any>(this.targetApiEndpoint+queryParams).pipe(map(carts=>{

      //Initialize cart object
      //TODO: Create a model for cart, now it is not readable.
      let cart:any;
      carts.forEach((cartItem:any) => {
        if(cartItem.user_id == activeUserId){
          cart = cartItem;
        }
      });
      return cart;
    }))
  }

  /**
   * Returns cart, Object:{id:number, user_id:number, cart:{product_id:number, count:number}[]}
   * @returns Observable<Object>
   */
   getCartWithProductNames():any{
    //Get id of the active user
    let activeUserId = this.sessionService.getIdOfLoggedInUser() as number;
    let queryParams = '?user_id='+activeUserId;

    //Send get request to get the cart of the user
    return this.http.get<any>(this.targetApiEndpoint+queryParams).pipe(mergeMap(carts=>{

      //Initialize cart object
      //TODO: Create a model for cart, it is not easily readable.
      let cart:any;
      let cartWithNames: any[] = []
      carts.forEach((cartItem:any) => {
        if(cartItem.user_id == activeUserId){
          cart = cartItem;
        }
      });
      //Return [] when the cart is empty.
      if(cart.cart.length == 0){
        return of (cartWithNames);
      }
      else{
        //Get cart items and get product names for every cart item (cart.cart is the array that we store products)
        return from(cart.cart).pipe(mergeMap(cartItemReference=>{
          return this.productService.getProductById((cartItemReference as any).product_id).pipe(mergeMap(product=>{
            (cartItemReference as any).product_name = (product as Product).name;
            cartWithNames.push(cartItemReference);
            return of(cartWithNames);
          }))
        }))
      }
      
    }))
  }

  /**
   * Takes product_id, adds that product to cart of active user
   * @param product_id 
   */
  addItemToCart(product_id:number){

      //Get the shopping cart object :{id:number, user_id:number, cart:{product_id:number, count:number}[]} 
      return this.getCart().pipe(switchMap(activeUserCart=>{

        //Find the product in cart and if the product is found in cart, increase its count property by one.
        let foundFlag=false;
        activeUserCart.cart.forEach((item: { product_id: number; count:number; })=>{
          if(item.product_id == product_id){
            item.count = item.count+1;
            foundFlag = true;
          }
        })
        //Product isn't found in the cart? Add new product to cart and set its count to one.
        if(!foundFlag){
          activeUserCart.cart.push({
            product_id: product_id,
            count:1
          });
        }
        
        //We modified active users cart, now we should send the updated cart object to database.
        return this.http.patch(this.targetApiEndpoint+'/'+activeUserCart.id,{cart:activeUserCart.cart});
      }))
  }

  /**
   * Takes product_id, removes that product to cart of active user
   * @param product_id 
   */
  removeItemFromCart(product_id:number){

    //Get the cart first.
    return this.getCart().pipe(switchMap(activeUserCart=>{

      //Find the product in cart and if the product is found in cart, decrease its count property by one.
      activeUserCart.cart.forEach((item: { product_id: number; count:number; })=>{
        if(item.product_id == product_id && item.count > 0){
          item.count = item.count-1;
        }
      })
      
      //We modified active users cart, now we should send the updated cart object to database.
      return this.http.patch(this.targetApiEndpoint+'/'+activeUserCart.id,{cart:activeUserCart.cart});
    }))
  }

  /**
   * Returns total price:number of the cart
   */
  getTotalPriceOfTheCart(){
    let totalPrice=0; 

    //Get cart first
    return this.getCart().pipe(mergeMap(activeUserCart=>{
      let cart = activeUserCart.cart;

      //Iterate over every cart item in order to sum their prices.
      return from(cart).pipe(mergeMap(cartItem=>{
         
        //Get product price and add to totalPrice
        return this.productService.getProductById(cartItem.product_id).pipe(map(product=>{
          totalPrice += (+(product as Product).price * cartItem.count);
          return totalPrice;
        }));
        
      }));
      
    }))
  }


  /**
   * Clears cart and logs
   * @returns Observable<void>
   */
  buy(){
    //Get active users cart
    return this.getCart().pipe(switchMap(cart=>{
      //Clear that cart
      return this.http.patch(this.targetApiEndpoint+'/'+cart.id,{cart:[]}).pipe(map(()=>{
        let customLogMessage = `User <${cart.user_id}> purchased some coffees.`;
        //Log custom message
        return this.jsonServerLogger.log(customLogMessage);
      }));
    }))
  }


}
