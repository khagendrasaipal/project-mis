import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from '../app.config';
import { ValidationService } from '../validation.service';
import { ProjectViewService } from './projectview.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-projectview',
  templateUrl: './projectview.component.html',
  styleUrls: ['./projectview.component.scss']
})
export class ProjectViewComponent {

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


  projectCycleForm!: FormGroup;
  formLayout: any;
  baseurl="";
  constructor(public appConfig:AppConfig,private router: Router,private toastr: ToastrService,private route: ActivatedRoute, private fb: FormBuilder, private RS: ProjectViewService){
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

  }
type:any;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.type = params['type'];
    });
    this.getProjectDetails(this.type);
    this.getActivity(this.type);
    this.getMessage(this.type);
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
pdetails:any
  getProjectDetails(id:any){
    this.RS.getProjectDetails(id).subscribe({next:(dt)=>{
      this.pdetails = dt[0];
      
    },error:err=>{

    }});
  }
msgs:any;
  getMessage(id:any){
    this.RS.getMessage(id).subscribe({next:(dt)=>{
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

  getMessageview(){
    const queryParams: any = {
      type: this.type // specify your query parameters here
  };
  const navigationExtras: NavigationExtras = {
    queryParams
};
this.router.navigate(['/message-view'], navigationExtras);
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
      console.log(dt);
      this.parents = dt;
      
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

