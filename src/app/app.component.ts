import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit{
  constructor(@Inject(DOCUMENT) document: Document, private loaderService: LoaderService, private renderer: Renderer2,private title:Title) {
    this.loaderService.httpProgress().subscribe((status: boolean) => {
      setTimeout(()=>{
        if (status) {
          document.getElementById('myOverLay')?.classList.add('showOverlay');
        } else {
          document.getElementById('myOverLay')?.classList.remove('showOverlay');
        }
      },100);
    });
  }


  ngOnInit(): void {
    this.title.setTitle("PAMS");
  }
}
