import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [],
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss'
})
export class LightboxComponent {
  @Input() images: string[] = [];
  currentImageIndex:number | null = null;

  openLightBox(index:number){
    this.currentImageIndex = index; 
  }

  closeLightBox(){
    this.currentImageIndex = null;
  }
  
  nextImage(){
    if (this.currentImageIndex !== null) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }
  }

  prevImage(){
    if (this.currentImageIndex !== null) {
      
    }
  }

}
