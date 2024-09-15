import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppConfig } from '../app.config';
import { SignupService } from './signup.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../validation.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  @ViewChild('template1') template1?: TemplateRef<any>;
  vs = ValidationService;
  
  modalRef?: BsModalRef;
  defaultForm = {
    "fullname": ['', Validators.required],
    "mobile": ['',[Validators.pattern(/^[0-9]{10}$/),Validators.required]],
    "email": ['',Validators.email],
    "dob": ['', [Validators.required,Validators.pattern(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)]],
    "gender": ['2', Validators.required],
    "password": ['', [Validators.required, this.vs.passwordValidator]],
    "cpassword": ['', [Validators.required, this.vs.passwordConfirmValidator]]
  }
  signupForm: FormGroup;
  model:any;
  display:any;
  otpForm:FormGroup;
  constructor(private router: Router,private modalService: BsModalService,public bsModalRef: BsModalRef,public appConfig: AppConfig, private signupService: SignupService, private fb: FormBuilder,private toastr:ToastrService,private SS:SignupService) {
    this.signupForm = fb.group(this.defaultForm);

    this.otpForm = this.fb.group({
      otp:['',[Validators.required,Validators.pattern('[0-9]+')]]
});
  }

  submitOtp(){
    if (this.otpForm.valid) {
      const otp = this.otpForm.value['otp'];
      // console.log("here");
      // console.log(otp);
      // console.log(this.reqid);
      // console.log(this.userid);
      if(this.reqid && this.userid && otp){
        const data = {
          otp:otp,
          reqid:this.reqid,
          userid:this.userid
        };
        this.SS.checkOtp(data).subscribe({next:(dt:any)=>{
          this.toastr.success("Signup successful.");
          this.bsModalRef.hide();
          this.signupForm = this.fb.group(this.defaultForm);
          this.router.navigate(['/login']);
          
            // if(dt.token){
            //   this.toastr.success("Signup successful.");
            //   this.router.navigate(['/']);
            // }else{
            //   this.toastr.error("Invalid otp.");
            
            // }
        },error:(err: { error: { message: string | undefined; }; })=>{
          this.toastr.error(err.error.message, 'Error');
        }})
      }
    } else {
      Object.keys(this.otpForm.controls).forEach(field => {
        const singleFormControl = this.otpForm.get(field);
        singleFormControl?.markAsTouched({onlySelf: true});
      });
    }
  }

  submit(){
    if (this.signupForm.valid) {
      if (this.signupForm.value.mobile == '' && this.signupForm.value.email == '') {
        this.toastr.error("Your Mobile or Email is required","Error");
          return;
      }
      this.model = this.signupForm.value;
      this.SS.create(this.model).subscribe({
        next:(result:any) => {
          console.log(result);
          this.openModalWithComponent(result.data.reqid,result.data.userid);
        // this.toastr.success(result.message, 'Success');
        // this.signupForm = this.fb.group(this.defaultForm);
      }, error:err => {
        this.toastr.error(err.error.message, 'Error');
      }
      });
    } else {
      Object.keys(this.signupForm.controls).forEach(field => {
        const singleFormControl = this.signupForm.get(field);
        singleFormControl?.markAsTouched({ onlySelf: true });
      });
    }
  }
reqid:any;userid:any;
  openModalWithComponent(reqid:any,userid:any){
    this.reqid=reqid;
    this.userid=userid;
    this.bsModalRef = this.modalService.show(this.template1!, Object.assign({}, { class: 'gray modal-xm' }));
  }

  

  ngOnInit(): void {

  }

}
