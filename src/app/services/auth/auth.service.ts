import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { User } from '../../models/user';
import { Observable, of, map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UserLogin } from 'src/app/models/user-login';
import { SessionService } from '../session/session.service';
import { UserSession } from 'src/app/models/user-session';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userTableName = 'users';

  constructor(private http:HttpClient,private router:Router, private sessionService:SessionService) { }

  /**
   * Takes User and performs user registration.
   * @param {User}account 
   * @returns Observable<any>
   */
  createNewAccount(account:User): any{
    let targetApiEndpoint = environment.baseApiUrl+this.userTableName;
    return this.http.post(targetApiEndpoint, account);
  }


  /**
   * Takes UserLogin, returns an Observable<boolean> due to success of the login process
   * @param credentials {AccountCredentials}
   * @returns Observable<boolean>
   */
   login(userLogin:UserLogin): Observable<boolean>{
    //Login logic flag
    let successful:boolean = false;
    let targetApiEndpoint = environment.baseApiUrl+this.userTableName;
    return this.http.get<User[]>(targetApiEndpoint).pipe(map(data=>{
      data.forEach(user=>{
        //If the db has the username password combination;
        if( user.email === userLogin.email && user.password === userLogin.password ){
          //login is successful
          successful = true;
          let userSession;
          if(user.id != undefined){
            userSession = new UserSession(user.id,new Date());
            this.sessionService.createNewSession(userSession);
          }
        }
      })
      return successful;
    }));
  }

  private checkIfUserExists(email:string):Observable<boolean>{
    let ifExists:boolean = false;
    return this.http.get<User[]>(environment.baseApiUrl + this.userTableName).pipe(map(data=>{
      data.forEach(user=>{
        //If the db has the email already;
        if( user.email === email){
          //login is successful
          ifExists = true;
        }
      })
      return ifExists;
    }));
  }

  /**
   * Takes id, returns User associated with given id. If nothing found, return null
   * @param {number}id 
   * @returns Observable<User | null>
   */
  getUserById(id:number): Observable<User | null>{
    let foundUser: User | null = null;
    return this.http.get<User[]>(environment.baseApiUrl + this.userTableName).pipe(map(users=>{
      users.forEach(user=>{
        if(user.id == id ){
          foundUser = user;
        }
      });
      return foundUser;
    }));
  }

  /**
   * Takes UserLogin, returns User associated with given id. If nothing found, return null
   * @param {UserLogin}id 
   * @returns Observable<User | null>
   */
  getUserByEmailAndPassword(userLogin:UserLogin){
    let foundUser: User | null = null;
    return this.http.get<User[]>(environment.baseApiUrl + this.userTableName).pipe(map(users=>{
      users.forEach(user=>{
        if(user.email == userLogin.email && user.password == userLogin.password){
          foundUser = user;
        }
      });
      return foundUser;
    }));
  }


}