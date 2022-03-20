import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product';
import { UserSession } from 'src/app/models/user-session';

@Injectable({
  providedIn: 'root'
})

/**
 * This service is responsible for session operations, uses localStorage.
 */
export class SessionService {

  constructor() { }

  /**
   * Creates a new user session.
   * @param {UserSession}user 
   */
  createNewSession(user:UserSession){
    localStorage.setItem('user',user.stringifyUserSession());
  }

  /**
   * Returns current user session.
   * @returns UserSession
   */
  getSession():UserSession{
    return JSON.parse(localStorage.getItem('user') as string );
  }

  /**
   * Takes UserSession, updates the localStorage 'user' key and returns given user.
   * @param user 
   * @returns UserSession
   */
  updateSession(user:UserSession){
    localStorage.setItem('user',JSON.stringify(user) );
    return user;
  }

  /**
   * Returns userId if a user logged in, null otherwise
   * @returns userId or null
   */
  getIdOfLoggedInUser():number | null{
    if(!this.isLoggedIn() ){
      return null;
    }
    let activeSession = this.getSession();
    return activeSession.userId;
  }

  /**
   * Returns true if logged in, false otherwise.
   * @returns boolean
   */
  isLoggedIn():boolean{
    return (localStorage.getItem('user') == undefined )? false : true;
  }

  /**
   * Destroys session.
   */
  logout(){
    localStorage.removeItem('user');
  }
}
