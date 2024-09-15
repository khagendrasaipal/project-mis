import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AppConfig } from '../app.config';
import { SignupService } from '../signup/signup.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  defaultForm = {
    "email":['',Validators.required]
  }
  forgotPasswordForm:FormGroup;
  constructor(public appConfig:AppConfig,private signupService:SignupService,private fb:FormBuilder) {
    this.forgotPasswordForm = fb.group(this.defaultForm);
  }
  
  ngOnInit(): void {
  }

}
