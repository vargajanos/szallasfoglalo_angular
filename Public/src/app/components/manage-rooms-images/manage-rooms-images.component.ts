import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { MessageService } from '../../services/message.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-manage-rooms-images',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './manage-rooms-images.component.html',
  styleUrl: './manage-rooms-images.component.scss'
})

export class ManageRoomsImagesComponent implements OnInit {

  selectedFile: File | null = null;
  roomId:string = '';
  images:any[] = [];
  server = environment.serverUrl;

  constructor(
    private api:ApiService,
    private activatedRoute: ActivatedRoute,
    private message: MessageService,
  ){}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  ngOnInit(): void {
    this.roomId = this.activatedRoute.snapshot.params['id'];
    this.getRommImages();
  }

   upload(){
    if (this.selectedFile){
      this.api.uploadFile(this.selectedFile).subscribe((res:any) => {
        if (res){
           console.log(res)
          let data = {
            ID: uuid(),
            roomID: this.roomId ,
            filename: res.file.filename,
            path: res.file.path
          }
          this.api.insert('images', data).subscribe(res =>{
            this.message.showMessage('OK', 'Sikeres képfeltöltés!', 'success');
            this.getRommImages();
          });
        }
      });
    }
   }

   getRommImages(){
    this.api.select('images', 'roomID', 'eq', this.roomId).subscribe((res:any) => {
      this.images = res;
    })
   }
}
