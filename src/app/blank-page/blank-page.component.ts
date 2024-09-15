import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from '../app.config';
import { ValidationService } from '../validation.service';
import { BlankPageService } from './blank-page.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blank-page',
  templateUrl: './blank-page.component.html',
  styleUrls: ['./blank-page.component.scss']
})
export class BlankPageComponent {

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

selectedItemsT: any = [];
  projectCycleForm!: FormGroup;
  projectCycleForms!: FormGroup;
  formLayout: any;
  formLayout1: any;
  baseurl="";
  constructor(public appConfig:AppConfig,private toastr: ToastrService,private router: Router, private fb: FormBuilder, private RS: BlankPageService){
    this.formLayout = {
      id :[''],
      parentid:[''],
      clientid:['',Validators.required],
      projectname:['',Validators.required],
      description: [''],
      startdate:['',Validators.required],
      enddate:[''],
      project_manager: ['',Validators.required],
      stageid:[''],   
      status:['1',Validators.required],
      palikaid:['',Validators.required]    ,
      iscompleted:['0',Validators.required]   ,
      // assignto:['']   
    }

    this.formLayout1 = {
      projectid :[''],
      assignto:['',Validators.required]
    }
    this.projectCycleForm =fb.group(this.formLayout);
    this.projectCycleForms =fb.group(this.formLayout1);
    this.baseurl=appConfig.baseUrl;
    this.srchForm = new FormGroup({
      entries: new FormControl('10'),
      srch_term: new FormControl('')})

  }

  ngOnInit(): void {
    this.getList();
    this.getProject();
    // this.getParents();
    this.getStaff();
    // this.getComments();

    this.getClient();
    this.getStages();
    this.getPalika();
    this.getParentProject();
   
  }

  palika:any
  getPalika(){
    this.RS.getPalika().subscribe({next:(dt)=>{
      this.palika = dt;
      
    },error:err=>{

    }});
  }
mainForm=false;
  addProject(){
    this.mainForm = !this.mainForm;
  }

  clients:any
getClient(){
    this.RS.getClient().subscribe({next:(dt)=>{
      this.clients = dt;
      
    },error:err=>{

    }});
  }

  groupingHelper(item:any){return item.parent};
  selectedAccount = '9';

  onItemSelectT(items:any){
    console.log(items);
    this.projectCycleForms.get('assignto')?.setValue(items);
  }

  onItemSelectTs(items:any){
    console.log(items);
    this.projectCycleForm.get('assignto')?.setValue(items);
  }

  compareFn = (item1: any, item2: any) => {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  };
models:any;
  projectCycleFormSubmits(){
    if (window.confirm('Are  you sure you want to assign this Project?')) {
   
    
      if (this.projectCycleForms.valid) {
        this.models = this.projectCycleForms.value;
        
        this.createItemAssign(this.projectCycleForms.value.id);
      } else {
        Object.keys(this.projectCycleForms.controls).forEach(field => {
        
          const singleFormControl = this.projectCycleForm.get(field);
          singleFormControl?.markAsTouched({onlySelf: true});
        });
        this.toastr.error('Please fill all the required* fields', 'Error');
      }
    }
  }

  createItemAssign(id=null){
    this.models.projectid=this.actid;
    let dt=this.models;
    this.RS.createItemAssign(dt).subscribe({
      next:(result:any) => {
      this.toastr.success('Item Successfully Saved!', 'Success');
      this.projectCycleForms = this.fb.group(this.formLayout1);
      // this.getActivity(this.dpid);
      this.visibleSelectBox = null;
      this.selectedItemsT = [];
      
    }, error:err => {
      this.toastr.error(err.error.message, 'Error');
    }
    });
  }
 

  
  actid:any;
  visibleSelectBox: number | null = null;
  assignProject(id:any,index:any){
    this.visibleSelectBox = this.visibleSelectBox === index ? null : index;
    this.actid=id;
    this.getEditAssign(this.actid);
  }

  getEditAssign(id: any) {
    this.RS.getEditAssign(id).subscribe(
      (result: any) => {
        this.model = result;
      
        this.selectedItemsT=result.assignto;
              this.projectCycleForms.get('assignto')?.setValue(this.selectedItemsT);
      },
      (error: any) => {
        this.toastr.error(error.error, 'Error');
      }
    );
  }
  

  stages:any
  getStages(){
    this.RS.getStages().subscribe({next:(dt)=>{
      this.stages = dt;
      
    },error:err=>{

    }});
  }
  
showP=false;

  getProjectview(id:any){
    const queryParams: any = {
      type: id // specify your query parameters here
  };
  const navigationExtras: NavigationExtras = {
    queryParams
};
this.router.navigate(['/activity-view'], navigationExtras);

  }
projects:any
getProject(){
    this.RS.getProject().subscribe({next:(dt)=>{
      this.projects = dt;
      
    },error:err=>{

    }});
  }
pprojects:any;
  getParentProject(){
    this.RS.getParentProject().subscribe({next:(dt)=>{
      this.pprojects = dt;
      
    },error:err=>{

    }});
  }

  getProjectchild(id:any){
    this.RS.getProjectchild(id).subscribe({next:(dt)=>{
      this.showP=true;
      this.projects = dt;
      
    },error:err=>{

    }});
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
      // this.getList();
    }, error :err=> {
      this.toastr.error(err.error.message, 'Error');
    }
    });
  } else {
    this.RS.create(upd).subscribe({
      next:(result:any) => {
      this.toastr.success('Item Successfully Saved!', 'Success');
      this.projectCycleForm = this.fb.group(this.formLayout);
      this.mainForm=!this.mainForm;
      this.getProject();
     
      // upd.approved=result.data.approved;
      // window.open(this.appConfig.baseUrl+"taxpayment/report-generate?voucherno="+ ks + '&palika=' + upd.palikaid, '_blank')
      // this.getList();
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

