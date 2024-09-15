import { Component, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from '../app.config';
import { ValidationService } from '../validation.service';
import { ProjectActivityService } from './project-activity.service';

@Component({
  selector: 'app-project-activity',
  templateUrl: './project-activity.component.html',
  styleUrls: ['./project-activity.component.scss']
})
export class ProjectActivityComponent {

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
  selectedItemsTss: any = [];

  projectCycleForm!: FormGroup;
  formLayout: any;
  baseurl="";
  constructor(private elementRef: ElementRef,public appConfig:AppConfig,private toastr: ToastrService, private fb: FormBuilder, private RS: ProjectActivityService){
    this.formLayout = {
      id :[''],
      parentid:[''],
      projectid:['',Validators.required],
      activityname:['',Validators.required],
      description: [''],
      startdate:['',Validators.required],
      enddate:[''],
      assignby: ['',Validators.required],
      assignto: ['',Validators.required],
      stageid:['',Validators.required],   
      status:['1',Validators.required] ,
      activityorder:['',Validators.required] ,
      appliesto:['1',Validators.required],
      dependency:['1',Validators.required],
      // dependent:['']          
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
    this.getParents(0);
    this.getStaff();
    this.getStages();
   
  }

  groupingHelper(item:any){return item.parent};
  selectedAccount = '9';
projects:any
getProject(){
    this.RS.getProject().subscribe({next:(dt)=>{
      this.projects = dt;
      
    },error:err=>{

    }});
  }

  onItemSelectT(items:any){
    console.log(items);
    this.projectCycleForm.get('assignto')?.setValue(items);
  }

  compareFn = (item1: any, item2: any) => {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  };

  parents:any
  getParents(pid:any){
    this.getParentss(pid);
    this.RS.getParentByProject(pid).subscribe({next:(dt)=>{
      this.parents = dt;
      
    },error:err=>{

    }});
  }

  onItemSelectTss(items:any){
    console.log(items);
    this.projectCycleForm.get('dependent')?.setValue(items);
  }

  compareFnss = (item1: any, item2: any) => {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  };

  isdep=false;
  dependencyCheck(id:any){
    if(id==1){
      this.isdep=false;
    }else{
      this.isdep=true;
    }

  }

  

  groupingHelperss(item:any){return item.parent};

  depacts:any
  getParentss(pid:any){
    this.RS.getParentss(pid).subscribe({next:(dt)=>{
      this.depacts = dt;

      
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

  stages:any
  getStages(){
    this.RS.getStages().subscribe({next:(dt)=>{
      this.stages = dt;
      
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
  this.displayOptions = [];
  this.backendData = [];
  const radioButtons = this.elementRef.nativeElement.querySelectorAll('input[type="radio"]');
  radioButtons.forEach((radio: { checked: boolean; }) => (radio.checked = false));

  // Close dropdown
  this.dropdownVisible = false;
 
}

resetForms(){
  // this.projectCycleForm =this.fb.group(this.formLayout);
  this.displayOptions = [];
  this.backendData = [];
  const radioButtons = this.elementRef.nativeElement.querySelectorAll('input[type="radio"]');
  radioButtons.forEach((radio: { checked: boolean; }) => (radio.checked = false));

  // Close dropdown
  // this.dropdownVisible = false;
 
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
  this.model.main="2";
  this.model.dependent=this.backendData;
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
      this.backendData=[];
      this.displayOptions=[];
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
      this.getParentss(this.model.projectid);
      if(result.dependency==1){
        this.isdep=false;
      }else{
        this.isdep=true;
      }
      this.projectCycleForm.patchValue(result);
      // this.getPalika();
      // this.projectCycleForm.patchValue(result);
      // this.changeFields();
      this.selectedItemsTss=result.dependent;
      this.selectedItemsT=result.assignto;
            console.log(this.selectedItemsT);
            this.projectCycleForm.get('assignto')?.setValue(this.selectedItemsT);
            // this.projectCycleForm.get('dependent')?.setValue(this.selectedItemsTss);
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

// options = [
//   { id: 1, name: 'Option 1' },
//   { id: 2, name: 'Option 2' },
//   { id: 3, name: 'Option 3' }
// ];

// // Store the second-level options for each selected option
// secondLevelOptions: { [key: string]: { id: string, name: string }[] } = {
//   '1': [
//     { id: '1A', name: 'Option 1A' },
//     { id: '1B', name: 'Option 1B' }
//   ],
//   '2': [
//     { id: '2A', name: 'Option 2A' },
//     { id: '2B', name: 'Option 2B' }
//   ],
//   '3': [
//     { id: '3A', name: 'Option 3A' },
//     { id: '3B', name: 'Option 3B' }
//   ]
// };

// selectedOptions: { [key: number]: boolean } = {}; 
// selectedNestedOptions: { [key: number]: any } = {};

// toggleOption(optionId: number) {
//   if (this.selectedOptions[optionId]) {
//     delete this.selectedOptions[optionId];
//   } else {
//     this.selectedOptions[optionId] = true;
//   }
// }

// onNestedSelect(optionId: number, event: Event) {
//   const selectElement = event.target as HTMLSelectElement;
//   this.selectedNestedOptions[optionId] = selectElement.value;
// }

// isSelected(optionId: number): boolean {
//   return !!this.selectedOptions[optionId];
// }

// dropdownVisible: boolean = false;
//   selectedValues: { [key: string]: string } = {};

//   toggleDropdown() {
//     this.dropdownVisible = !this.dropdownVisible;
//   }

//   onRadioChange(option: string, value: string) {
//     this.selectedValues[option] = value;
//     this.updateSelectedText();
//   }

//   updateSelectedText(): string {
//     const selectedText = Object.keys(this.selectedValues).map(
//       key => `${key}: ${this.selectedValues[key]}`
//     );
//     return selectedText.length > 0 ? selectedText.join(', ') : 'Select an option';
//   }

//   closeDropdown(event: Event) {
//     const target = event.target as HTMLElement;
//     if (!target.closest('.custom-dropdown')) {
//       this.dropdownVisible = false;
//     }
//   }
dropdownVisible = false;
  displayOptions: { name: string, status: string }[] = [];
  backendData: { actid: number, status: number }[] = [];
toggleDropdown() {
  this.dropdownVisible = !this.dropdownVisible;
}

onRadioChange(actid: number, status: any) {
  const option = this.depacts.find((depact: { id: number; }) => depact.id === actid);
  const statusText = status === 2 ? 'Partial' : 'Full';
  
  // Update displayOptions array
  const existingDisplayOption = this.displayOptions.find(opt => opt.name === option?.name);
  if (existingDisplayOption) {
    existingDisplayOption.status = statusText;
  } else {
    this.displayOptions.push({ name: option?.name, status: statusText });
  }

  // Update backendData array
  const existingBackendOption = this.backendData.find(opt => opt.actid === actid);
  if (existingBackendOption) {
    existingBackendOption.status = status;
  } else {
    this.backendData.push({ actid, status });
  }

  console.log('Display Options:', this.displayOptions);
  console.log('Backend Data:', this.backendData);
}

updateSelectedText(): string {
  return this.displayOptions.length > 0
    ? this.displayOptions.map(option => `${option.name}: ${option.status}`).join(', ')
    : 'Select an option';
}

@HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.dropdownVisible = false;
    }
  }


}
