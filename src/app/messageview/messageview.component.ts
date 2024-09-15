import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from '../app.config';
import { ValidationService } from '../validation.service';
import {MessageViewService } from './messageview.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-messageview',
  templateUrl: './messageview.component.html',
  styleUrls: ['./messageview.component.scss']
})
export class MessageViewComponent {
  @ViewChild('template1') template1?: TemplateRef<any>;
  vs = ValidationService;
  model: any = {};
  disabled = false;
  error = '';
  lists: any;

  selectedCars!: any;

  selectedCar!: any;

  perPages = [10, 20, 50, 100];
  pagination = {
    total: 0,
    currentPage: 0,
    perPage: 10
  };
  searchTerm: string = '';
  column: string = '';
  isDesc: boolean = false;
  srchForm!: FormGroup;

  otpForm:FormGroup;

  projectCycleForm!: FormGroup;
  formLayout: any;
  baseurl="";
  constructor(public appConfig:AppConfig,private router: Router,private modalService: BsModalService,public bsModalRef: BsModalRef,private toastr: ToastrService,private route: ActivatedRoute, private fb: FormBuilder, private RS: MessageViewService){
    this.formLayout = {
      id :[''],
      activityid:[''],
      projectid:['',Validators.required],
      content:['',Validators.required],
      staffid: ['',Validators.required],
      commentid: ['']
         
    }
    this.projectCycleForm =fb.group(this.formLayout);
    this.baseurl=appConfig.baseUrl;
    this.srchForm = new FormGroup({
      entries: new FormControl('10'),
      srch_term: new FormControl('')})

      this.otpForm = this.fb.group({
        // parentid:[''],
        projectid:['',Validators.required],
        content:['',Validators.required],
        activityid: ['',Validators.required],
        commentid:['',Validators.required],
       
    });

  }
type:any;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.type = params['type'];
    });
    this.getProjectDetails(this.type);
    this.getActivity(this.type);
    this.getMessage(this.type);
    this.getAllActivity(this.type);
    // alert(this.type);
    // this.getList();
    // this.getProject();
    // this.getParents();
    // this.getStaff();
    // this.getComments();
   
  }
projects:any
getProject(){
    this.RS.getProject().subscribe({next:(dt)=>{
      this.projects = dt;
      
    },error:err=>{

    }});
  }
  sendReply(mid:any,aid:any){
    // alert("send reply");
    // this.openModalWithComponent(mid,aid);
  }
  lastClickedItem: any = null;
  mainForm=false;
  toggleForm(item:any,mid:any,aid:any): void {
    if(aid==0){
      this.sbox=true;
      this.mainForm = !this.mainForm;
      // this.mainForm=true;
      item.showForm = !item.showForm;
      if (this.lastClickedItem && this.lastClickedItem !== item) {
        this.lastClickedItem.showForm = false;
      }
    }else{
      this.mainForm = false;
      this.act=aid;
      this.cid=mid;
      this.sbox=false;
    }
    if (this.lastClickedItem && this.lastClickedItem !== item) {
      this.lastClickedItem.showForm = false;
    }
    item.showForm = !item.showForm;
    this.lastClickedItem = item;
  }


act:any;cid:any;sbox=false;
  openModalWithComponent(mid:any,aid:any){
    if(aid==0){
      this.sbox=true;
    }else{
      this.act=aid;
      this.cid=mid;
      this.sbox=false;
    }
   
  
    this.bsModalRef = this.modalService.show(this.template1!, Object.assign({}, { class: 'gray modal-lg' }));
  }

  submitOtp(){
    const content = this.otpForm.value['content'];
    let data:any;
    if(content=="" || content==undefined){
      this.toastr.error("Content is  required", 'Error');
      return;
    }
    if(this.sbox){
      const actid = this.otpForm.value['activityid'];
      if(actid=="" || actid==undefined){
        this.toastr.error("Activity is  required", 'Error');
        return;
      }
       data = {
        content:content,
        projectid:this.type,
        activityid:actid,
        commentid:0
      };
      
    }else{
       data = {
        content:content,
        projectid:this.type,
        activityid:this.act,
        commentid:this.cid
      };
    }
    
    
    this.RS.sendReply(data).subscribe({next:(dt:any)=>{
      this.toastr.success("Reply sent successfully.");
      this.mainForm=false;
      // this.bsModalRef.hide();
      this.getMessage(this.type);
      this.otpForm.patchValue({'content':""});
    
    },error:(err: { error: { message: string | undefined; }; })=>{
      // console.log(err);
      this.toastr.error("fill the required field", 'Error');
    }})
  }

  
pdetails:any
  getProjectDetails(id:any){
    this.RS.getProjectDetails(id).subscribe({next:(dt)=>{
      this.pdetails = dt[0];
      
    },error:err=>{

    }});
  }
msgs:any;
  getMessage(id:any){
    this.RS.getMessagePc(id).subscribe({next:(dt)=>{
      this.msgs = dt;
      
    },error:err=>{

    }});
  }

  getActvityview(){
    // alert(this.type);
    const queryParams: any = {
      type: this.type // specify your query parameters here
  };
  const navigationExtras: NavigationExtras = {
    queryParams
};
this.router.navigate(['/activity-view'], navigationExtras);
  }

  gotohome(){
    this.router.navigate(['/blank-page']);
  }

  parents:any
  getParents(){
    this.RS.getParents().subscribe({next:(dt)=>{
      this.parents = dt;
      
    },error:err=>{

    }});
  }

  getActivity(id:any){
    this.RS.getActivity(id).subscribe({next:(dt)=>{
      this.parents = dt;
      
    },error:err=>{

    }});
  }
activities:any;
  getAllActivity(id:any){
    this.RS.getActivityAll(id).subscribe({next:(dt)=>{
      this.activities = dt;
      
    },error:err=>{

    }});
  }

  staffs:any
  getStaff(){
    this.RS.getStaff().subscribe({next:(dt)=>{
      this.staffs = dt;
      
    },error:err=>{

    }});
  }

  comments:any
  getComments(){
    this.RS.getComments().subscribe({next:(dt)=>{
      this.comments = dt;
      
    },error:err=>{

    }});
  }
  
// revenue:any;
 

  
  getList(pageno?: number | undefined) {
    const page = pageno || 1;
    this.RS.getList(this.pagination.perPage, page, this.searchTerm, this.column, this.isDesc).subscribe(
      (result: any) => {
        this.lists = result.data;
        this.pagination.total = result.total;
        this.pagination.currentPage = result.currentPage;
        // console.log(result);
      },
      error => {
         this.toastr.error(error.error);
      }
    );
  }
  
 



  paginatedData($event: { page: number | undefined; }) {
    this.getList($event.page);
  }

  


projectCycleFormSubmit(){

  if (window.confirm('Are  you sure you want to save this item?')) {
   
    
    if (this.projectCycleForm.valid) {
      this.model = this.projectCycleForm.value;
      
      this.createItem(this.projectCycleForm.value.id);
    } else {
      Object.keys(this.projectCycleForm.controls).forEach(field => {
      
        const singleFormControl = this.projectCycleForm.get(field);
        singleFormControl?.markAsTouched({onlySelf: true});
      });
      // this.toastr.error('Please fill all the required* fields', 'Error');
    }
  }
  // }
 
}



resetForm(){
  this.projectCycleForm =this.fb.group(this.formLayout);
 
}


search() {
  this.pagination.perPage=this.srchForm.value.entries;
  this.searchTerm=this.srchForm.value.srch_term;
  this.getList();
}

resetFilters() {
  this.getList();
}

// paginatedData($event: { page: number | undefined; }) {
//   this.getList($event.page);
// }

changePerPage(perPage: number) {
  this.getList();
}


createItem(id = null) {
  // this.model.voucherinfo = this.items;
  let upd = this.model;
  
  if (id != "" && id != null) {

    this.RS.update(id, upd).subscribe({
      next: (result :any) => {
      this.toastr.success('Item Successfully Updated!', 'Success');
      this.projectCycleForm = this.fb.group(this.formLayout)
      this.getList();
    }, error :err=> {
      this.toastr.error(err.error.message, 'Error');
    }
    });
  } else {
    this.RS.create(upd).subscribe({
      next:(result:any) => {
      this.toastr.success('Item Successfully Saved!', 'Success');
      this.projectCycleForm = this.fb.group(this.formLayout);
     
      // upd.approved=result.data.approved;
      // window.open(this.appConfig.baseUrl+"taxpayment/report-generate?voucherno="+ ks + '&palika=' + upd.palikaid, '_blank')
      this.getList();
    }, error:err => {
      this.toastr.error(err.error.message, 'Error');
    }
    });
  }
}


getUpdateItem(id: any) {
  this.RS.getEdit(id).subscribe(
    (result: any) => {
      this.model = result;
      
      this.projectCycleForm.patchValue(result);
      // this.getPalika();
      this.projectCycleForm.patchValue(result);
      // this.changeFields();
    },
    (error: any) => {
      this.toastr.error(error.error, 'Error');
    }
  );
}

deleteItem(id: any) {
  if (window.confirm('Are sure you want to delete this item?')) {
    this.RS.remove(id).subscribe((result: any) => {
      this.toastr.success('Item Successfully Deleted!', 'Success');
      this.getList();
    }, (error: { error: any; }) => {
      this.toastr.error(error.error, 'Error');
    });
  }
}


}

