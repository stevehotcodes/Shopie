import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


export interface IloggedUser{
  email:string,
  token:string
  // role:string
}
export interface ISignedUserDetails{
  id: string
  firstname:string
  lastname:string
  email:string
  role:string
  isDeleted:number
   password:string
  isWelcomed:number

}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private  http:HttpClient, private route:Router) { }
  
  signin(loggedUser:IloggedUser) {
    localStorage.setItem('shopieLoggedUseremail', loggedUser.email)
    localStorage.setItem('shopieLoggedUserToken', loggedUser.token)
    // localStorage.setItem('shopieLoggedRole', loggedUser.role)

    // window.location.reload()
  }
  signOut(){
    localStorage.removeItem('shopieLoggedUseremail')
    localStorage.removeItem('shopieLoggedUserToken')
     this.route.navigate(['/'])
    // window.location.reload()
  }
  getLoggedUser() {
    const email = localStorage.getItem('shopieLoggedUseremail')
    const token = localStorage.getItem('shopieLoggedUserToken')
    const loggedUser = email && token ? {email, token} : null

    return loggedUser
  
  }
  getUserSignInToken(){
    const email=localStorage.getItem('shopieLoggedUseremail');
    const token=localStorage.getItem('shopieLoggedUserToken');
    
    const signinedUser =  token?true : false
    console.log(signinedUser)
    return signinedUser
    
  
  }
  checkAdmin(){
    let userRole=localStorage.getItem('shopieLoggedRole')
    return userRole==='admin'? true : false
  
  }
  getSignedInUser():Observable<ISignedUserDetails >{
    return this.http.get<ISignedUserDetails>('http://localhost:3000/user/logged')
  }


}
