import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from '../app.config';
import { ValidationService } from '../validation.service';
import { ManageactivityService } from './manageactivity.service';

@Component({
  selector: 'app-manageactivity',
  templateUrl: './manageactivity.component.html',
  styleUrls: ['./manageactivity.component.scss']
})
export class ManageactivityComponent {

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

  itemObjectsMain:any;
  projectCycleForm!: FormGroup;
  clientForm!: FormGroup;
  formLayout: any;
  baseurl="";
  selectedItemsT: any = [];
  constructor(public appConfig:AppConfig,private toastr: ToastrService, private fb: FormBuilder, private RS: ManageactivityService){
    this.formLayout = {
      clientid :[''],
      assignto:[''],
      projectid:['',Validators.required]
      // taxpayerid: ['',Validators.required],
    
      // clientname:['',Validators.required],
      // address: ['',Validators.required],   
      // contactperson:['',Validators.required],
      // contactmobile:['', [Validators.pattern(/^[0-9]{10}$/),Validators.required]],
      // contactemail:['', Validators.email],
      // status:['1',Validators.required]            
    }
    this.projectCycleForm =fb.group(this.formLayout);
    this.baseurl=appConfig.baseUrl;
    this.srchForm = new FormGroup({
      entries: new FormControl('10'),
      srch_term: new FormControl('')})

  }

  ngOnInit(): void {
    this.getList();
    this.getProject();
    this.getStaff();
    // this.getActivity(5);
   
  }

  staffs:any
  getStaff(){
    this.RS.getStaff().subscribe({next:(dt)=>{
      this.staffs = dt;
      
    },error:err=>{

    }});
  }
models:any;
  projectCycleFormSubmit(){
    if (window.confirm('Are  you sure you want to assign this activity?')) {
   
    
      if (this.projectCycleForm.valid) {
        this.models = this.projectCycleForm.value;
        
        this.createItemAssign(this.projectCycleForm.value.id);
      } else {
        Object.keys(this.projectCycleForm.controls).forEach(field => {
        
          const singleFormControl = this.projectCycleForm.get(field);
          singleFormControl?.markAsTouched({onlySelf: true});
        });
        this.toastr.error('Please fill all the required* fields', 'Error');
      }
    }
  }

  createItemAssign(id=null){
    this.models.activityid=this.actid;
    let dt=this.models;
    this.RS.createItemAssign(dt).subscribe({
      next:(result:any) => {
      this.toastr.success('Item Successfully Saved!', 'Success');
      // this.projectCycleForm = this.fb.group(this.formLayout);
      this.getActivity(this.dpid);
      this.visibleSelectBox = null;
      this.selectedItemsT = [];
      // upd.approved=result.data.approved;
      // window.open(this.appConfig.baseUrl+"taxpayment/report-generate?voucherno="+ ks + '&palika=' + upd.palikaid, '_blank')
      // this.getList();
    }, error:err => {
      this.toastr.error(err.error.message, 'Error');
    }
    });
  }

  groupingHelper(item:any){return item.parent};
  selectedAccount = '9';

  onItemSelectT(items:any){
    console.log(items);
    this.projectCycleForm.get('assignto')?.setValue(items);
  }

  compareFn = (item1: any, item2: any) => {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  };

  projects:any
  getProject(){
      this.RS.getProject().subscribe({next:(dt)=>{
        this.projects = dt;
        
      },error:err=>{
  
      }});
    }
items:any;
dpid:any;
  getActivity(id:any){
    // this.getStaffbyProject(id);
    this.items=null;
    if(id){
    this.dpid=id;
    this.RS.getActivityAll(id).subscribe({next:(dt)=>{
      this.items = dt;
      // console.log(this.itemObjectsMain);
      
    },error:err=>{

    }});
  }
  }

  getStaffbyProject(id:any){
    this.RS.getStaffbyProject(id).subscribe({next:(dt)=>{
      this.staffs = dt;
      // console.log(this.itemObjectsMain);
      
    },error:err=>{

    }});
  }

  draggedItemIndex: number | null = null;

  onDragStart(event: DragEvent, index: number) {
    this.draggedItemIndex = index;
    event.dataTransfer?.setData('text/plain', `${index}`);
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault(); // Necessary to allow dropping
  }

  onDrop(event: DragEvent, index: number) {
    event.preventDefault();
    const draggedIndex = this.draggedItemIndex;

    if (draggedIndex !== null) {
      this.swapItems(draggedIndex, index);
      this.draggedItemIndex = null;
      this.saveOrder();
    }
  }

  swapItems(fromIndex: number, toIndex: number) {
    const temp = this.items[fromIndex];
    this.items[fromIndex] = this.items[toIndex];
    this.items[toIndex] = temp;
  }

  saveOrder() {
    // Update the activityorder property
    this.items.forEach((item:any, index:any) => {
      item.activityorder = index + 1;
    });
    console.log('New order:', this.items);
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

  


clientFormSubmit(){

  if (window.confirm('Are  you sure you want to save this item?')) {
    this.createItem();
   
    
    // if (this.clientForm.valid) {
    //   this.model = this.clientForm.value;
      
    //   this.createItem(this.clientForm.value.clientid);
    // } else {
    //   Object.keys(this.clientForm.controls).forEach(field => {
      
    //     const singleFormControl = this.clientForm.get(field);
    //     singleFormControl?.markAsTouched({onlySelf: true});
    //   });
    //   // this.toastr.error('Please fill all the required* fields', 'Error');
    // }
  }
  // }
 
}



resetForm(){
  this.clientForm =this.fb.group(this.formLayout);
 
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
  this.model.orderinfo=this.items;
  // this.model.voucherinfo = this.items;
  let upd = this.model;
  
    this.RS.createOrder(upd).subscribe({
      next:(result:any) => {
      this.toastr.success('Item Successfully Saved!', 'Success');
      this.getActivity(this.dpid);
     
      // upd.approved=result.data.approved;
      // window.open(this.appConfig.baseUrl+"taxpayment/report-generate?voucherno="+ ks + '&palika=' + upd.palikaid, '_blank')
      this.getList();
    }, error:err => {
      this.toastr.error(err.error.message, 'Error');
    }
    });
 
}
actid:any;
visibleSelectBox: number | null = null;
assignActivity(id:any,index:any){
  this.visibleSelectBox = this.visibleSelectBox === index ? null : index;
  this.actid=id;
  this.getEditAssign(this.actid,this.dpid);
}

getUpdateItem(id: any) {
  this.RS.getEdit(id).subscribe(
    (result: any) => {
      this.model = result;
      
      this.clientForm.patchValue(result);
      // this.getPalika();
      this.clientForm.patchValue(result);
      // this.changeFields();
    },
    (error: any) => {
      this.toastr.error(error.error, 'Error');
    }
  );
}

getEditAssign(id: any,pid:any) {
  this.RS.getEditAssign(id,pid).subscribe(
    (result: any) => {
      this.model = result;
   
      this.selectedItemsT=result.assignto;
            console.log(this.selectedItemsT);
            this.projectCycleForm.get('assignto')?.setValue(this.selectedItemsT);
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
