import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLogin } from 'src/app/models/user-login';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup | any;
  showLoginErrorMessageBox:boolean = false;
  constructor(private formBuilder:FormBuilder, private authService:AuthService,private router:Router) { }

  ngOnInit(): void {
    this.showLoginErrorMessageBox = false;
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required] ],
      password:['', [Validators.required] ],
    });
  }

  onSubmit(){
    //Defensive check
    if(!this.loginForm.valid){
      return;
    } 
    
    let user:UserLogin = {
      email:this.loginForm.get('email')?.value,
      password:this.loginForm.get('password')?.value
    };

    //Send request
    this.authService.login(user).subscribe(success=>{
      if(success){
        this.router.navigateByUrl('/shop');
      }else{
        this.showLoginErrorMessageBox = true;
      }
    })
  }


}
