import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from '../app.config';
import { ValidationService } from '../validation.service';
import { ProjectStatusService } from './projectstatus.service';
import {jsPDF} from 'jspdf';
import * as XLSX from "xlsx";
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-projectstatus',
  templateUrl: './projectstatus.component.html',
  styleUrls: ['./projectstatus.component.scss']
})
export class ProjectStatusComponent {
  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef|any ;
  @ViewChild("table1") table1: ElementRef | any;
  @ViewChild("table2") table2: ElementRef | any;
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

  clientForm!: FormGroup;
  formLayout: any;
  baseurl="";
  constructor(public appConfig:AppConfig,private toastr: ToastrService, private fb: FormBuilder, private RS: ProjectStatusService){
    this.formLayout = {
      clientid :[''],
      // taxpayerid: ['',Validators.required],
    
      // clientname:['',Validators.required],
      // address: ['',Validators.required],   
      // contactperson:['',Validators.required],
      // contactmobile:['', [Validators.pattern(/^[0-9]{10}$/),Validators.required]],
      // contactemail:['', Validators.email],
      // status:['1',Validators.required]            
    }
    this.clientForm =fb.group(this.formLayout);
    this.baseurl=appConfig.baseUrl;
    this.srchForm = new FormGroup({
      entries: new FormControl('10'),
      srch_term: new FormControl('')})

  }

  ngOnInit(): void {
    this.getList();
    this.getProject();
    // this.getActivity(5);
   
  }

  fireEvent() {
    // Preprocess tables to convert <li> and other HTML into plain text
    const preprocessTable = (tableElement: HTMLElement) => {
      const clonedTable = tableElement.cloneNode(true) as HTMLElement;
  
      // Convert <li> elements to plain text with line breaks
      const listItems = clonedTable.querySelectorAll('li');
      listItems.forEach((li) => {
        li.innerHTML = li.innerText.replace(/\n/g, ''); // Replace line breaks for Excel compatibility
      });
  
      return clonedTable;
    };
  
    // Process first table
    const processedTable1 = preprocessTable(this.table1.nativeElement);
    const ws1: XLSX.WorkSheet = XLSX.utils.table_to_sheet(processedTable1);
  
    // Process second table
    const processedTable2 = preprocessTable(this.table2.nativeElement);
    const ws2: XLSX.WorkSheet = XLSX.utils.table_to_sheet(processedTable2);
  
    // Same logic for merging as previously discussed
    const ws1Range = XLSX.utils.decode_range(ws1['!ref']!);
    const ws1LastRow = ws1Range.e.r + 2;
    const ws2Range = XLSX.utils.decode_range(ws2['!ref']!);
    
    for (let R = ws2Range.s.r; R <= ws2Range.e.r; ++R) {
      for (let C = ws2Range.s.c; C <= ws2Range.e.c; ++C) {
        const cell = ws2[XLSX.utils.encode_cell({ r: R, c: C })];
        if (cell) {
          ws1[XLSX.utils.encode_cell({ r: R + ws1LastRow, c: C })] = cell;
        }
      }
    }
  
    ws1['!ref'] = XLSX.utils.encode_range({
      s: { r: ws1Range.s.r, c: ws1Range.s.c },
      e: { r: ws1LastRow + ws2Range.e.r - 1, c: Math.max(ws1Range.e.c, ws2Range.e.c) }
    });
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, "CombinedSheet");
  
    XLSX.writeFile(wb, "project_status.xlsx");
  }
  

  // fireEvent() {
  //   // First table: Convert to sheet
  //   const ws1: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
  //     this.table1.nativeElement // First table reference
  //   );
  
  //   // Second table: Convert to sheet
  //   const ws2: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
  //     this.table2.nativeElement // Second table reference
  //   );
  
  //   // Find the last row of the first table (ws1)
  //   const ws1Range = XLSX.utils.decode_range(ws1['!ref']!); // Get the range of the first sheet
  //   const ws1LastRow = ws1Range.e.r + 2; // Get the last row and add some space for the second table
  
  //   // Merge the second table into the first sheet (ws1)
  //   const ws2Range = XLSX.utils.decode_range(ws2['!ref']!);
  //   for (let R = ws2Range.s.r; R <= ws2Range.e.r; ++R) {
  //     for (let C = ws2Range.s.c; C <= ws2Range.e.c; ++C) {
  //       const cell = ws2[XLSX.utils.encode_cell({ r: R, c: C })];
  //       if (cell) {
  //         // Place ws2 content into ws1 below the first table
  //         ws1[XLSX.utils.encode_cell({ r: R + ws1LastRow, c: C })] = cell;
  //       }
  //     }
  //   }
  
  //   // Update the range of the new combined worksheet
  //   const combinedRange = {
  //     s: { r: ws1Range.s.r, c: ws1Range.s.c },
  //     e: { r: ws1LastRow + ws2Range.e.r - 1, c: Math.max(ws1Range.e.c, ws2Range.e.c) }
  //   };
  //   ws1['!ref'] = XLSX.utils.encode_range(combinedRange);
  
  //   /* Create a new workbook */
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  
  //   /* Append the combined sheet */
  //   XLSX.utils.book_append_sheet(wb, ws1, "CombinedSheet");
  
  //   /* Save the file */
  //   XLSX.writeFile(wb, "SheetJS_CombinedTables.xlsx");
  // }

  // fireEvent() {
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
  //     this.table1.nativeElement
  //   );

  //   /* new format */
  //   var fmt = "0.00";
  //   /* change cell format of range B2:D4 */
  //   var range = { s: { r: 1, c: 1 }, e: { r: 2, c: 100000 } };
  //   for (var R = range.s.r; R <= range.e.r; ++R) {
  //     for (var C = range.s.c; C <= range.e.c; ++C) {
  //       var cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
  //       if (!cell || cell.t != "n") continue; // only format numeric cells
  //       cell.z = fmt;
  //     }
  //   }
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  //   var fmt = "@";
  //   wb.Sheets["Sheet1"]["F"] = fmt;

  //   /* save to file */
  //   XLSX.writeFile(wb, "SheetJS.xlsx");
  // }

  public downloadAsPDF() {
    const element = this.pdfTable.nativeElement;

    // Capture the content of the div as a canvas
    html2canvas(element, { useCORS: true, scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('l', 'mm', 'a3'); // 'l' for landscape, 'a3' size
      const imgWidth = 420; // A3 width in mm
      const pageHeight = 297; // A3 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page with the content
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if necessary
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('content.pdf');
    }).catch(error => {
      console.error('Error generating PDF', error);
    });
  
  
  }
pstatus:any;
pname:any;
showTab=false;
iscmp:any;
headers:any;
  getStatus(pid:any){
   
    this.dettab=false;
    this.showTab=false;
    this.RS.getProjectStatus(pid).subscribe({next:(dt)=>{
      this.pstatus = dt;
      console.log(this.pstatus);
      if(this.pstatus[0]){
        // this.headers = Object.keys(this.pstatus[0]).filter(key => key !== 'projectname');
        this.headers = Object.keys(this.pstatus[0])
        .filter(key => key !== 'id' && key !== 'projectname');
        
      this.showTab=true;
      this.pname=dt[0].projectname;
      if(this.pstatus[0].iscompleted==1){
        this.iscmp="Completed";
      }else{
        this.iscmp="Inprogress";
      }
     
      }
      // console.log(this.itemObjectsMain);
      
    },error:err=>{

    }});
  }
details:any;
dettab=false;
  getDetails(pid:any){
    this.RS.getStatusDetails(pid).subscribe({next:(dt)=>{
      this.details = dt;
      // this.fireEvent();
      if(this.details[0]){
        this.dettab=true;
      }else{
        this.dettab=false;
      }
      // this.downloadAsPDF();
      
    },error:err=>{

    }});
  }

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
    this.dpid=id;
    this.RS.getActivityAll(id).subscribe({next:(dt)=>{
      this.items = dt;
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
