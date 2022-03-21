import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, mergeMap, from, of, switchMap } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductCategory } from 'src/app/models/product-category';
import { environment } from 'src/environments/environment';
import { SessionService } from '../session/session.service';

/**
 * This service is responsible for product crud operations.
 */

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsTableName = 'products';
  private productCategoriesTableName = 'productCategories';
  private productCommentsTableName = 'productComments';
  private targetApiEndpoint = environment.baseApiUrl+this.productsTableName;

  constructor(private http:HttpClient, private sessionService:SessionService) { }

  /**
   *  Takes filter string and category_id, returns products as Observable<Product[]>
   * @param {string}filter 
   * @param {number}category_id 
   * @returns 
   */
  getProducts(filter:string, category_id:number){
    //Initialize filter and category in case they are undefined.
    if(filter == undefined){
      filter = '';
    }
    if(category_id == undefined){
      category_id = 0;
    }
    //Get products
    return this.http.get<Product[]>(this.targetApiEndpoint).pipe(map(product=>{
      //Filter by name and category
      return product.filter(product=> product.category == category_id && product.name.toLowerCase().includes(filter.toLowerCase()) );
    }));

  }

  /**
   * Returns product by id, if not found returns null.
   * @param product_id 
   * @returns Product or null
   */
  getProductById(product_id:number):Observable<Product | null>{
    //Get products
    return this.http.get<Product[]>(this.targetApiEndpoint).pipe(map(products=>{
      let wantedProduct:Product | null = null;
      products.forEach(product=>{
        if(product.id == product_id){
          //Product found
          wantedProduct = product;
        }
      })
      return wantedProduct;
    }));
  }

  /**
   * Returns all product categories.
   * @returns Observable<ProductCategory[]>
   */
  getProductCategories():Observable<ProductCategory[]>{
    return this.http.get<ProductCategory[]>(environment.baseApiUrl+this.productCategoriesTableName);
  }

  /**
   * Returns all product comments for given product id.
   * @param product_id 
   * @returns product comments
   */
  getProductComments(product_id:number){
    let queryParams = `?product_id=${product_id}`;
    let comments:any[] = [];
    return this.http.get(environment.baseApiUrl + this.productCommentsTableName + queryParams).pipe(mergeMap(productCommentsReference=>{
      return from(productCommentsReference as any[]).pipe(mergeMap(productCommentReference=>{
        return this.http.get(environment.baseApiUrl + 'users'+'?id='+productCommentReference.user_id).pipe(map(user=>{
          productCommentReference.username = (user as any)[0].username;
          comments.push(productCommentReference);
          return comments;
        }));
      }));
    }))
  }

  /**
   * Adds a new comment to given product
   * @param product_id 
   * @param comment 
   * @returns 
   */
  addCommentToProduct(product_id:number, comment:string):Observable<any>{
    let activeUserId = this.sessionService.getIdOfLoggedInUser() as number;
    let postData = {
      user_id: activeUserId,
      product_id: product_id,
      comment: comment
    }
    return this.http.post(environment.baseApiUrl+this.productCommentsTableName,postData);
  }
}
