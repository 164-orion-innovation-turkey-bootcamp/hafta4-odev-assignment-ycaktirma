import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControlOptions } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserLogin } from 'src/app/models/user-login';
import { AuthService } from 'src/app/services/auth/auth.service';
import { passwordAgainValidator } from '../../validators/password-again-validator';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm:FormGroup | any;
  showSignupErrorMessageBox:boolean = false;
  constructor(private formBuilder:FormBuilder, private authService:AuthService,private router:Router) { }

  ngOnInit(): void {
    this.createSignupForm();
    this.showSignupErrorMessageBox = false;
  }

  createSignupForm(){
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)] ],
      name:['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')] ],
      password:['', [Validators.required, Validators.minLength(6)] ],
      passwordAgain: ['',  ]
    }, {
      validators: passwordAgainValidator
    })
  }

  onSubmit(){
    //Defensive check
    if(!this.signupForm.valid){
      return;
    }

    //TODO: password and email should not be stored on User model. Use UserLogin instead. Send both UserLogin and User models to service
    let user = new User(
                    this.signupForm.get('username')?.value,
                    this.signupForm.get('name')?.value,
                    this.signupForm.get('password')?.value,
                    this.signupForm.get('email')?.value
                    );

    //Send request
    this.authService.createNewAccount(user).subscribe((response)=>{
      let newUserLogin:UserLogin={
        email: user.email,
        password: user.password
      }
      //If user exists, show error box, if not perform login.
      if(!(response == 'userExists')){
        this.authService.login(newUserLogin).subscribe(()=>{
          this.router.navigateByUrl('/shop');
        })
      }
      else{
        this.showSignupErrorMessageBox = true;
      }
    });
  }

}
