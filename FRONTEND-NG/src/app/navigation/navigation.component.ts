import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
      isLoggedIn:boolean=true
      logIn!: boolean;
      

     constructor(private authSvc:AuthService){
      this.logIn=this.authSvc.getUserSignInToken()
      console.log(this.logIn)
     }

     logOut()
      {
        if(this.logIn==true){
          
          this.isLoggedIn=false
          this.authSvc.signOut()
          
          
        }
     }



}
