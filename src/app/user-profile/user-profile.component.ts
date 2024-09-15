import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from '../app.config';
import { SignupService } from '../signup/signup.service';
import { ValidationService } from '../validation.service';
import { UserProfileService } from './user-profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  vs = ValidationService;
users:any;
userinfo:any;
formLayout: any;
formLayout1: any;
baseurl="";
 
  userProfileForm:FormGroup;
  passwordForm:FormGroup;
  constructor(public appConfig:AppConfig,private ps:UserProfileService,private fb:FormBuilder,private toastr:ToastrService) {
    this.formLayout = {
      // id:['',Validators.required],
      fullname: ['',Validators.required],
      dob: ['',Validators.required],
      gender:['',Validators.required],
      photo:['']
    }
    this.formLayout1 = {
      // id:['',Validators.required],
      currentPassword: ['',Validators.required],
      password: ['', [Validators.required, this.vs.passwordValidator]],
      cpassword: ['', [Validators.required, this.vs.passwordConfirmValidator]]
      
    }
  
    this.userProfileForm = fb.group(this.formLayout);
    this.passwordForm = fb.group(this.formLayout1);
    this.baseurl=appConfig.baseUrl;
  }

  ngOnInit(): void {
    this.getUserinfo();
  }
  getUserinfo(){
    this.ps.getUserinfo().subscribe({next:(dt)=>{
      this.users = dt;
      this.userinfo=this.users[0];
      this.userProfileForm.patchValue({'fullname':this.userinfo.fullname,'gender':this.userinfo.gender,'dob':this.userinfo.dob});
      // console.log(this.users[0]);
      // this.voucherBankForm.patchValue({"lgid":this.dlgid});
    },error:err=>{

    }});
  }
model:any;
  userProfileFormSubmit(){
    this.model = this.userProfileForm.value;
    let formData: FormData = new FormData();
    const fileInput = document.getElementById('pfile') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file: File = fileInput.files[0];
      const fileName: string = file.name;
      const fileExtension: string = fileName.substring(fileName.lastIndexOf('.') + 1);
    if(fileExtension=="jpg" || fileExtension=="jpeg" || fileExtension=="png"){
    
    formData.append('file', file, file.name);
    formData.append('fullname',this.model.fullname);
   formData.append('dob',this.model.dob);
   formData.append('gender',this.model.gender);
  //  console.log(formData);
    this.ps.update(formData).subscribe({
      next: (result :any) => {
      this.toastr.success('Item Successfully Updated!', 'Success');
      this.userProfileForm.patchValue({'photo':''});
      this.getUserinfo();
     
    }, error :err=> {
      this.toastr.error(err.error.message, 'Error');
    }
    });
  }else{
    this.toastr.error("Please upload file in(jpg,jpeg,png) format", 'Error');
  }
    
    }else{
      this.ps.updateInfo(this.model).subscribe({
        next: (result :any) => {
        this.toastr.success('Item Successfully Updated!', 'Success');
        this.getUserinfo();
       
      }, error :err=> {
        this.toastr.error(err.error.message, 'Error');
      }
      });
    }
  
  }
model1:any;
  passwordFormSubmit(){
    this.model1 = this.passwordForm.value;
    this.ps.changePassword(this.model1).subscribe({
      next: (result :any) => {
      this.toastr.success('Password changed Successfully !', 'Success');
      this.passwordForm = this.fb.group(this.formLayout1)
      // this.getUserinfo();
     
    }, error :err=> {
      this.toastr.error(err.error.message, 'Error');
    }
    });
  }

  isHovered: boolean = false;
  onMouseEnter() {
    this.isHovered = true;
  }
  onMouseLeave() {
    this.isHovered = false;
  }

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  handleImageClick() {
    this.fileInput.nativeElement.click();
  }
}
