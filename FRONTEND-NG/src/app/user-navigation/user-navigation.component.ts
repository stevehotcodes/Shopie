import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { FlashmessagesService } from '../services/flashmessages.service';

@Component({
  selector: 'app-user-navigation',
  templateUrl: './user-navigation.component.html',
  styleUrls: ['./user-navigation.component.css']
})
export class UserNavigationComponent implements OnInit {
  userDetails:any
  
  constructor(private authSvc:AuthService,private userSvc:UserService,private flashMsgSvc:FlashmessagesService){}
  ngOnInit(){
    // this.getSignedUser()
    this.userDetails= localStorage.getItem('shopieLoggedUseremail')
    console.log(this.userDetails)
  }

  logOut(){
    this.flashMsgSvc.pushMessage({
      type:'info',
      message:"logging  out "
    })
    this.authSvc.signOut()
    
  }

  getSignedUser(){
    this.userSvc.getSignedInUser().subscribe(
      (res:any)=>{
        console.log(res)
        this.userDetails=res
        console.log("new user details",this.userDetails)
      }
   
    )
  }



}
