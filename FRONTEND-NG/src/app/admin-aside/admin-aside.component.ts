import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FlashmessagesService } from '../services/flashmessages.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin-aside',
  templateUrl: './admin-aside.component.html',
  styleUrls: ['./admin-aside.component.css']
})
export class AdminAsideComponent implements OnInit {
  userDetails: any;

  constructor(private authSvc:AuthService,private flashMsg:FlashmessagesService,private userSvc:UserService){}

  logOut(){
    this.authSvc.signOut()
    this.flashMsg.pushMessage({
      type:'info',
      message:"log out successful"
    })
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
  ngOnInit(){
    this.getSignedUser()
    this.userDetails= localStorage.getItem('shopieLoggedUseremail')
    
  }
}
