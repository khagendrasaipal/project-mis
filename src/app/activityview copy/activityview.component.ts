import { Component, ElementRef, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from '../app.config';
import { ValidationService } from '../validation.service';
import {ActivityViewService } from './activityview.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Options,LabelType } from '@angular-slider/ngx-slider';
import * as $ from 'jquery';

@Component({
  selector: 'app-activityview',
  templateUrl: './activityview.component.html',
  styleUrls: ['./activityview.component.scss']
})
export class ActivityViewComponent {
  // @ViewChild('buttonRefs') buttonRefs: ElementRef | undefined;
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
  otpForms:FormGroup;

  selectedItemsT: any = [];
  selectedItemsTs: any = [];
  selectedItemsTss: any = [];
  // projectCycleForm!: FormGroup;
  formLayout: any;
  baseurl="";
  // value: number = 3;
  // options: Options = {
  //   floor: 1,
  //   ceil: 3
  // };

  value: number = 1;
  options: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 1, legend: "Not Started" },
      { value: 2, legend: "In progress" },
      { value: 3, legend: "Completed" }
    ]
  };



  constructor(private elementRef: ElementRef,public appConfig:AppConfig,private modalService: BsModalService,public bsModalRef: BsModalRef,private router: Router,private toastr: ToastrService,private route: ActivatedRoute, private fb: FormBuilder, private RS: ActivityViewService){
    // this.formLayout = {
    //   id :[''],
    //   activityid:[''],
    //   projectid:['',Validators.required],
    //   content:['',Validators.required],
    //   staffid: ['',Validators.required],
    //   commentid: ['']
         
    // }
    // this.projectCycleForm =fb.group(this.formLayout);
    this.baseurl=appConfig.baseUrl;
    this.srchForm = new FormGroup({
      entries: new FormControl('10'),
      srch_term: new FormControl('')})

      this.otpForm = this.fb.group({
      // parentid:[''],
      // projectid:['',Validators.required],
      activityname:['',Validators.required],
      description: [''],
      startdate:['',Validators.required],
      enddate:[''],
      assignby: ['',Validators.required],
      assignto: ['',Validators.required],
      stageid:['',Validators.required],
      status:['1',Validators.required],
      appliesto:['1',Validators.required],
      dependency:['1',Validators.required],
      // dependent:['']
  });

  this.otpForms = this.fb.group({
    
    content:['',Validators.required],
    audience:[''],
    mfile:['']
    // isMain:['']
    
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
    // alert(this.type);
    // this.getList();
    // this.getProject();
    this.getParents(this.type);
    this.getStaff();
    this.getStages();
    this.getTeam();
    // this.getComments();
   
  }

  changeRange(val:any){
    alert(val);
  }

  groupingHelpers(item:any){return item.parent};
  selectedAccounts = '9';

  onItemSelectTs(items:any){
    // console.log(items);
    this.otpForms.get('audience')?.setValue(items);
  }

  compareFns = (item1: any, item2: any) => {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  };

  onItemSelectTss(items:any){
    console.log(items);
    this.otpForms.get('dependent')?.setValue(items);
  }

  compareFnss = (item1: any, item2: any) => {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  };

  

  groupingHelperss(item:any){return item.parent};

  submitmsg(){
    const content = this.otpForms.value['content'];
    const audience=this.otpForms.value['audience'];
    const files=this.otpForms.value['mfile'];
    // let ismain=this.otpForms.value['isMain'];
    let cmntid=this.cid;
    if(cmntid==undefined || cmntid==""){
      cmntid=0;
    }
    let data:any;
    // console.log(ismain);
    if(cmntid==0){
      if(audience=="" || audience==undefined){
        this.toastr.error("Audience is  required", 'Error');
      return;
      }
    }
    if(content=="" || content==undefined){
      this.toastr.error("Content is  required", 'Error');
      return;
    }
    data = {
      content:content,
      projectid:this.type,
      activityid:this.act,
      commentid:cmntid,
      audience:audience,
      files:this.fileNames
    };
    // console.log(data);

    this.RS.sendReply(data).subscribe({next:(dt:any)=>{
      this.toastr.success("Message sent successfully.");
      // this.mainForms=false;
      // this.bsModalRef.hide();
      // this.getMessage(this.type);
      this.otpForms.patchValue({'content':""});
      this.otpForms.patchValue({'audience':""});
      this.otpForms.patchValue({'mfile':""});
      this.fileNames = [];
      this.disfile=[];
     
      this.RS.getMsg(this.act,this.type).subscribe({next:(dt)=>{
        this.messages = dt;
        
      },error:err=>{
  
      }});
    
    },error:(err: { error: { message: string | undefined; }; })=>{
      // console.log(err);
      this.toastr.error("fill the required field", 'Error');
    }})
  }
  sbox=false;
  sendReply(cid:any,aid:any){
    // this.sbox=true;
  }

  getInitial(fullname: string): string {
    // return fullname ? fullname.charAt(0).toUpperCase() : '';
    if (!fullname) return '';

  const words = fullname.split(' ');
  let initials = '';

  words.forEach(word => {
    initials += word.charAt(0).toUpperCase();
  });

  return initials;
  }

  lastClickedItems: any = null;
  mainForms=false;
  act:any;
  cid:any;
  // groupingHelper(item:any){return item.parent};
  selectedAccount = '9';

  // onItemSelectT(items:any){
  //   console.log(items);
  //   this.projectCycleForm.get('assignto')?.setValue(items);
  // }

  compareFn = (item1: any, item2: any) => {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  };


  isDropdownOpen = false;
  items = [
    { name: 'Option 1', selected: false },
    { name: 'Option 2', selected: false },
    { name: 'Option 3', selected: false },
    { name: 'Option 4', selected: false },
  ];

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  getSelectedItems(): string {
    const selectedItems = this.items.filter(item => item.selected).map(item => item.name);
    console.log(selectedItems);
    return selectedItems.length > 0 ? selectedItems.join(', ') : 'Audiences';
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isDropdownOpen = false;
    }
  }

  onItemSelect(event: Event, item: any) {
    event.stopPropagation();
    item.selected = !item.selected;
  }

  toggleForms(items:any,mid:any,aid:any): void {
    this.act=0;
    this.cid=0;
    if(mid==0){
      this.sbox=true;
      this.mainForms = !this.mainForms;
      // this.mainForm=true;
      items.showForms = !items.showForms;
      if (this.lastClickedItems && this.lastClickedItems !== items) {
        this.lastClickedItems.showForms = false;
      }
    }else{
      this.mainForms = false;
      this.act=aid;
      this.cid=mid;
      this.sbox=false;
    }
    this.act=aid;
    if (this.lastClickedItems && this.lastClickedItems !== items) {
      this.lastClickedItems.showForms = false;
      // this.mainForms=true;
    }
    items.showForms = !items.showForms;
    this.lastClickedItems = items;
  }

messages:any;
msgform=false;
  composeMsg(activityid:any,projectid:any){
    
    this.cid=0;
    this.act=activityid;
    this.messages=null;
    this.RS.getMsg(activityid,projectid).subscribe({next:(dt)=>{
      this.messages = dt;
      
    },error:err=>{

    }});
    // this.openModalWithComponent();

  }
  // fileNames: string[] = [];
  fileNames: { path: string, name: string }[] = [];
  disfile: string[] = [];
  isUploading: boolean = false;
  async handleFileInput(e: Event) {

    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    const file = files[0];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      this.toastr.error('Please select a PDF, JPEG, or JPG file.');
      return;
    }
    if (file.size >= 2097152) {  //2 MB (UNIT in Bytes)
      this.toastr.error(" Uploaded File shouldn't be more than 2 mb", "Error");
      return;
    }

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    this.RS.uploadFile(formData).subscribe({
      next: (data: any) => {
        // console.log(data);
        if (data.status) {
          this.fileNames.push({ path: data.path, name: file.name });
          this.disfile.push(file.name);
          console.log(this.fileNames);
          // this.otpForms.patchValue({ 'mfile': data.path });
          this.isUploading = false;
        }
      }, error: err => {
        this.isUploading = false;
        // console.log(err);
      }
    })

  }

  removeFile(index:any){
    this.fileNames.splice(index, 1);
    this.disfile.splice(index, 1);
  }

  openModalWithComponent(){
    this.selectedItemsTs="";
    
      this.otpForms.patchValue({'content':""});
      // this.otpForms.patchValue({'audience':""});
      this.otpForms.patchValue({'mfile':""});
    this.mainForms=true;
   
    this.bsModalRef = this.modalService.show(this.template1!, Object.assign({}, { class: 'gray modal-xl' }));
  }

  toggleClass: string = 'tgl-def';
  toggleText: string = 'Disabled';

//   filterme(value: any) {
//     value = parseInt(value, 10); // Convert to an integer
// alert(value);
//     if (value === 1) {
//       this.toggleClass = 'tgl-on';
//       this.toggleText = 'Enabled';
//     } else if (value === 2) {
//       this.toggleClass = 'tgl-def';
//       this.toggleText = 'Undetermined';
//     } else if (value === 3) {
//       this.toggleClass = 'tgl-off';
//       this.toggleText = 'Disabled';
//     }
//   }
slabel:any;
filterme(value:any,id:any,main:any) {
if(value==1){
this.slabel="Not Started";
}
if(value==2){
this.slabel="In Progress";
}
if(value==3){
this.slabel="Completed";
}

console.log(this.slabel);
  if (window.confirm('Are  you sure you want to change the status to '+this.slabel+'?')) {

  value = parseInt(value, 10); // Convert to an integer
  
  if (value === 1) {
    $('#custom-toggle'+id).removeClass('tgl-off').addClass('tgl-on');
    $('#custom-toggle'+id).removeClass( 'tgl-def').addClass('tgl-on');
    $('#stext'+id).text('Not Started');
  } else if (value === 2) {
    $('#custom-toggle'+id).removeClass('tgl-on').addClass('tgl-def');
    $('#custom-toggle'+id).removeClass('tgl-off').addClass('tgl-def');
    $('#stext'+id).text('In progress');
  } else if (value === 3) {
    $('#custom-toggle'+id).removeClass( 'tgl-on').addClass('tgl-off');
    $('#custom-toggle'+id).removeClass('tgl-def').addClass('tgl-off');
    $('#stext'+id).text('Completed');
  }
  this.RS.completeStatus(value,id,this.type,main).subscribe({next:(dt)=>{
    this.toastr.success('Status changed successfully !', 'Success');
    this.getActivity(this.type);
    // this.comments = dt;
    
  },error:err=>{
    // console.log(err);
    this.toastr.error(err.error.message, 'Error');
  }});
}
this.getActivity(this.type);
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

 

  stages:any
  getStages(){
    this.RS.getStages().subscribe({next:(dt)=>{
      this.stages = dt;
      
    },error:err=>{

    }});
  }
isdep=false;
  dependencyCheck(id:any){
    if(id==1){
      this.isdep=false;
    }else{
      this.isdep=true;
    }

  }

  
msgs:any;
  getMessage(id:any){
    this.RS.getMessage(id).subscribe({next:(dt)=>{
      this.msgs = dt;
      
    },error:err=>{

    }});
  }

  addMainActivity(){
    alert("add main activity");
  }
 amain:any;
  addActivity(id:any,event: MouseEvent,main:any){
    // alert(main);
    this.amain=main;
    event.preventDefault();
    // this.openModalWithComponent(id);
    // alert("sub activity to be added in id: "+id);
  }

  // openModalWithComponent(reqid:any){
  
  //   this.bsModalRef = this.modalService.show(this.template1!, Object.assign({}, { class: 'gray modal-lg' }));
  // }
  showButton: boolean = false;
  lastClickedItem: any = null;
  lastHoverItem: any = null;
actid:any;mainForm=false;

toggleBtn(item:any): void{
 
 
  // alert("hello");
  if (this.lastHoverItem && this.lastHoverItem !== item) {
    this.lastHoverItem.showIcon = false;
  }
  item.showIcon = true;
  this.lastHoverItem = item;

}
composeMsgs(activityid:any,projectid:any,item:any){
  this.mainForms=true;
  if(activityid==0){
    this.mainForms = !this.mainForms;
    // this.mainForm=true;
    item.showForms = !item.showForms;
    if (this.lastClickedItem && this.lastClickedItem !== item) {
      this.lastClickedItem.showForms = false;
    }
    return;
  }

  // this.mainForms = false;
    // this.actid=aid;
    if (this.lastClickedItem && this.lastClickedItem !== item) {
      this.lastClickedItem.showForms = false;
    }
    item.showForms = !item.showForms;
    this.lastClickedItem = item;
}

  toggleForm(item:any,aid:any): void {
    this.backendData=[];
    this.displayOptions=[];
    this.selectedItemsT=[];
    this.actid=aid;
    if(aid==0){
      this.mainForm = !this.mainForm;
      // this.mainForm=true;
      item.showForm = !item.showForm;
      if (this.lastClickedItem && this.lastClickedItem !== item) {
        this.lastClickedItem.showForm = false;
      }
      this.otpForm = this.fb.group({
        // parentid:[''],
        // projectid:['',Validators.required],
        activityname:['',Validators.required],
        description: [''],
        startdate:['',Validators.required],
        enddate:[''],
        assignby: ['',Validators.required],
        assignto: ['',Validators.required],
        stageid:['',Validators.required],
        status:['1',Validators.required],
        activityorder:['',Validators.required],
        appliesto:['1',Validators.required],
        dependency:['1',Validators.required],
        // dependent:['']
    });
      // this.otpForm = this.fb.group(this.formLayout);
      return;
    }
    this.mainForm = false;
    // this.actid=aid;
    if (this.lastClickedItem && this.lastClickedItem !== item) {
      this.lastClickedItem.showForm = false;
    }
    item.showForm = !item.showForm;
    this.lastClickedItem = item;
    this.otpForm = this.fb.group({
      // parentid:[''],
      // projectid:['',Validators.required],
      activityname:['',Validators.required],
      description: [''],
      startdate:['',Validators.required],
      enddate:[''],
      assignby: ['',Validators.required],
      assignto: ['',Validators.required],
      stageid:['',Validators.required],
      status:['1',Validators.required],
      activityorder:['',Validators.required],
      appliesto:['1',Validators.required],
      dependency:['1',Validators.required],
      // dependent:['']
  });
    // this.otpForm.patchValue({""});
  }

  teams:any
getTeam(){
    this.RS.getTeam().subscribe({next:(dt)=>{
      this.teams = dt;
      
    },error:err=>{

    }});
  }

  toggleVisibility(button: HTMLButtonElement) {
    button.classList.toggle('show');
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

  groupingHelper(item:any){return item.parent};
  // selectedAccount = '9';


  onItemSelectT(items:any){
    console.log(items);
    this.otpForm.get('assignto')?.setValue(items);
  }

  // compareFn = (item1: any, item2: any) => {
  //   return item1 && item2 ? item1.id === item2.id : item1 === item2;
  // };

  depacts:any
  getParents(pid:any){
    this.RS.getParents(pid).subscribe({next:(dt)=>{
      this.depacts = dt;

      // this.depacts.forEach((item: { id: number; }) => {
      //   item.id = +item.id; // The '+' operator converts the string to a number
      // });

      console.log(this.depacts);
      
    },error:err=>{

    }});
  }
parents:any
  getActivity(id:any){
    this.RS.getActivity(id).subscribe({next:(dt)=>{
      this.parents = dt;
      
    },error:err=>{

    }});
  }

  staffs:any
  getStaff(){
    this.RS.getStaff(this.type).subscribe({next:(dt)=>{
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

  // completeTask(id:any,event: Event){
  //   const checkbox = event.target as HTMLInputElement;
  // const isChecked = checkbox.checked;
  // // Now you can do whatever you want based on whether the checkbox is checked or unchecked
  // if (isChecked) {
  //   if (window.confirm('Are  you sure you want to complete  this activity?')) {
  //     this.RS.completeStatus(3,id,this.type).subscribe({next:(dt)=>{
  //       this.toastr.success('Item Successfully Updated!', 'Success');
  //       this.getActivity(this.type);
  //       // this.comments = dt;
        
  //     },error:err=>{
  //       this.toastr.error('Unable to Update!', 'Error');
  //     }});

  //   }
  // }else{
  //   if (window.confirm('Are  you sure you want to make  this activity as incomplete?')) {
  //     this.RS.completeStatus(1,id,this.type).subscribe({next:(dt)=>{
  //       this.toastr.success('Item Successfully Updated!', 'Success');
  //       this.getActivity(this.type);
  //       // this.comments = dt;
        
  //     },error:err=>{
  //       this.toastr.error('Unable to Update!', 'Error');
  //     }});
  //   }
  // }
  // this.getActivity(this.type); 
  // }


  submitActDetails(){

  if (window.confirm('Are  you sure you want to save this item?')) {
   
    
    if (this.otpForm.valid) {
      this.model = this.otpForm.value;
      
      this.createItem(this.otpForm.value.id);
    } else {
      Object.keys(this.otpForm.controls).forEach(field => {
      
        const singleFormControl = this.otpForm.get(field);
        singleFormControl?.markAsTouched({onlySelf: true});
      });
      // this.toastr.error('Please fill all the required* fields', 'Error');
    }
  }
  // }
 
}



resetForm(){
  this.otpForm =this.fb.group(this.formLayout);
  this.selectedItemsT=[];
  // this.otpForms =this.fb.group(this.formLayout);
 
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
  this.model.dependent=this.backendData;
  this.model.projectid=this.type;
  this.model.parentid=this.actid;
  this.model.main=this.amain;
  let upd = this.model;
  if (id != "" && id != null) {

    this.RS.update(id, upd).subscribe({
      next: (result :any) => {
      this.toastr.success('Item Successfully Updated!', 'Success');
      this.otpForm = this.fb.group(this.formLayout)
      this.getList();
    }, error :err=> {
      this.toastr.error(err.error.message, 'Error');
    }
    });
  } else {
    this.RS.create(upd).subscribe({
      next:(result:any) => {
        this.mainForm=false;
        // console.log(result);
        this.getActivity(this.type);
      this.toastr.success('Item Successfully Saved!', 'Success');
     
      this.otpForm = this.fb.group(this.formLayout);
      // this.mainForm=false;
      // this.mainForm = !this.mainForm;
      this.resetForms();
      this.resetForm();
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
      if(result.dependency==1){
        this.isdep=false;
      }else{
        this.isdep=true;
      }
      
      this.otpForm.patchValue(result);
      // this.getPalika();
      this.otpForm.patchValue(result);
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

resetForms(){
  // this.projectCycleForm =this.fb.group(this.formLayout);
  this.displayOptions = [];
  this.backendData = [];
  const radioButtons = this.elementRef.nativeElement.querySelectorAll('input[type="radio"]');
  radioButtons.forEach((radio: { checked: boolean; }) => (radio.checked = false));

  // Close dropdown
  // this.dropdownVisible = false;
 
}

dropdownVisible = false;
  displayOptions: { name: string, status: string }[] = [];
  backendData: { actid: number, status: number }[] = [];
toggleDropdowns() {
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

