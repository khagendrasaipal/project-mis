import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from '../app.config';
import { ValidationService } from '../validation.service';
import { DocumentSettingService } from './document-setting.service';

@Component({
  selector: 'app-document-setting',
  templateUrl: './document-setting.component.html',
  styleUrls: ['./document-setting.component.scss']
})
export class DocumentSettingComponent {

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
    perPage: 0
  };
  searchTerm: string = '';
  column: string = '';
  isDesc: boolean = false;
  srchForm!: FormGroup;


  cars = [
      { id: 1, name: 'Volvo' },
      { id: 2, name: 'Saab' },
      { id: 3, name: 'Opel' },
      { id: 4, name: 'Audi' },
  ];

  car = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
];
  items = new Array();
  linkTaxPayerForm!: FormGroup;
  formLayout: any;
  banks:any;
  btnlvl=" List of Branches ";
  llgs:any;
  baseurl="";
  constructor(public appConfig:AppConfig,private toastr: ToastrService, private fb: FormBuilder, private RS: DocumentSettingService){
    this.formLayout = {
      id:[''],
      // taxpayerid: ['',Validators.required],
    
      appliesto:['',Validators.required],
      code: ['',Validators.required],   
      docnameen:['',Validators.required],
      docnamenp:['',Validators.required]            
    }
    this.linkTaxPayerForm =fb.group(this.formLayout);
    this.baseurl=appConfig.baseUrl;
    this.srchForm = new FormGroup({
      entries: new FormControl('10'),
      srch_term: new FormControl('')})

  }

  ngOnInit(): void {
    this.getList();
    // this.getBanks();
    // this.getDistrict();
    // this.getTaxpayer();
    // this.getRevenue(1);
    // this.getUserprofile();

  }
dist:any;
  getDistrict(){
    this.RS.getDistrict().subscribe({next:(d:any)=>{
      this.dist = d;
    },error:err=>{

    }});
  }

  profile:any;
  getUserprofile(){
    this.RS.getUserprofile().subscribe({next:(d:any)=>{
      this.profile = d;
      this.linkTaxPayerForm.patchValue({"taxpayername":this.profile[0].fullname,"mobile":this.profile[0].mobile})
    },error:err=>{

    }});
  }

  tpayers:any;
  getTaxpayer(){
    this.RS.getTaxpayer().subscribe({next:(d:any)=>{
      this.tpayers = d;
    },error:err=>{

    }});
  }
  tinfo:any;
  getPayerinfo(id:any){
    this.RS.getPayerinfo(id).subscribe({next:(d:any)=>{
      this.tinfo = d;
    },error:err=>{

    }});
  }
rcode:any;
  getPalika(){
    let id=this.linkTaxPayerForm.value.districtid;
    this.RS.getPalikaAll(id).subscribe({next:(d:any)=>{
      this.llgs = d;
    },error:err=>{

    }});
  }
// revenue:any;
  getRevenue(type:any){
   
    this.RS.getRevenue(type).subscribe({next:(d:any)=>{
      this.revs = d;
    },error:err=>{

    }});
  }

  getBanks(){

  }
  doctype:any;
  getDoctype(code:any){
    let ln = code.charAt(code.length - 1);
    if(ln==3){
      ln=2;
    }
    if(ln==1 || ln==2){
    this.RS.getdoctype(ln).subscribe({next:(d:any)=>{
      this.doctype = d;
    },error:err=>{
     
    }});
  }else{
    this.toastr.error('Invalid Taxpayer Code.', 'Error');
    this.linkTaxPayerForm.patchValue({"taxpayercode":""});
  }
  }
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
  revs: any;
  totalAmt = 0;
  addItem() {
    //  console.log(this.rv);

    let rc = this.linkTaxPayerForm.value['revenuecode'];
    let rt=this.linkTaxPayerForm.value['rtype'];
    //  console.log(rc)
    let amt = this.linkTaxPayerForm.value['amount'];

    //  if(amt)
    if (amt && rc && this.linkTaxPayerForm.get('amount')?.valid) {
      let val;
      for (const item of this.revs) {
        if (item.code === rc) {
          val = item.code + '[' + item.name + ']';
          // console.log(`Found key-value pair: ${item.key} : ${item.value}`);
          break;
        }
      }

      var newItem = {
        rt:rt,
        rc: rc,
        amt: amt,
        rv: val
      };

      const isRtValueEqual = this.items.every(obj => obj.rt === rt);

if (isRtValueEqual) {
  console.log("same");
} else {
  this.toastr.error('Different Account Type cannot be added.', 'Error'); 
  this.linkTaxPayerForm.patchValue({'revenuecode':"",'amount':'','rtype':''})
  return;
}




      // Add the new item to the items array
      this.items.push(newItem);
      this.calctotal();
      this.linkTaxPayerForm.patchValue({ "revenuecode": '' });
      this.linkTaxPayerForm.patchValue({ "amount": '' });
      this.getRevenue(rt);


    }


  }

  paginatedData($event: { page: number | undefined; }) {
    this.getList($event.page);
  }

  getType(){
    let rc = this.linkTaxPayerForm.value['revenuecode'];
    if(rc<33340){
      this.linkTaxPayerForm.patchValue({'rtype':33340});
    }else{
      this.linkTaxPayerForm.patchValue({'rtype':33341});
    }
  }

  calctotal() {
    this.totalAmt = 0;
    for (const item of this.items) {
      this.totalAmt += parseFloat(item.amt);

    }
    this.totalAmt=parseFloat(this.totalAmt.toFixed(2));
  }

  removeItem(index: any) {
    if(this.items.length==1){
      this.linkTaxPayerForm.patchValue({'rtype':''});
      this.getRevenue(1);
    }
    // alert(index);
    this.items.splice(index, 1);
    this.calctotal();
  }


linkTaxPayerFormSubmit(){
  // this.addItem();
  // console.log(this.items);
  // if (this.fileCheck()){
  //  console.log(this.linkTaxPayerForm.value);
  if (window.confirm('Are  you sure you want to save this setting?')) {
    
    // this.linkTaxPayerForm.patchValue({ amount: this.totalAmt });
    
    if (this.linkTaxPayerForm.valid) {
      this.model = this.linkTaxPayerForm.value;
      
      this.createItem(this.linkTaxPayerForm.value.id);
    } else {
      Object.keys(this.linkTaxPayerForm.controls).forEach(field => {
      
        const singleFormControl = this.linkTaxPayerForm.get(field);
        singleFormControl?.markAsTouched({onlySelf: true});
      });
      // this.toastr.error('Please fill all the required* fields', 'Error');
    }
  }
  // }
 
}

fileCheck(){
  const inputElement: any = document.querySelector('input[type="file"]');
  if (inputElement && inputElement.files && inputElement.files.length > 0) {
  const fileName= inputElement.files[0]?.name;
  const selectedFile: File = inputElement.files[0];
    // console.log('Selected file name:', selectedFile.size);
    if (selectedFile.size >= 2097152){
      this.toastr.error('Uploaded file must be PDF or Image (2MB only).', 'Error'); 
      return false;
    }

    if( fileName.substring(fileName.lastIndexOf('.') + 1)== 'pdf' || fileName.substring(fileName.lastIndexOf('.') + 1)== 'jpg'){
       
      return true;
    }else{
      this.toastr.error('Uploaded file must be PDF or Image (2MB only).', 'Error');
      return false;
    }

    return true;
  }else{
    this.toastr.error('File is required', 'Error'); 
    return false;
  }
}

isbtn=true;

// changeFields() {
//   var frm = document.getElementsByClassName('needs-validation')[0]
//   var table = document.getElementsByClassName('tab')[0]

//   frm.classList.toggle('hide');
//   table.classList.toggle('hide')

//     this.isbtn = !this.isbtn;
// }

resetForm(){
  this.linkTaxPayerForm =this.fb.group(this.formLayout);
  this.items=new Array();
  this.getUserprofile();
  this.getRevenue(1);
  
  // this.linkTaxPayerForm.patchValue({'bankid':this.banks[0].id});
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
      this.linkTaxPayerForm = this.fb.group(this.formLayout)
      this.getList();
    }, error :err=> {
      this.toastr.error(err.error.message, 'Error');
    }
    });
  } else {
    this.RS.create(upd).subscribe({
      next:(result:any) => {
      this.toastr.success('Item Successfully Saved!', 'Success');
      this.linkTaxPayerForm = this.fb.group(this.formLayout);
     
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
      
      this.linkTaxPayerForm.patchValue(result);
      // this.getPalika();
      this.linkTaxPayerForm.patchValue(result);
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
