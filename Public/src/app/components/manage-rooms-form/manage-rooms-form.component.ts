import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Room } from '../../interfaces/room';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MessageService } from '../../services/message.service';
import { v4 as uuid } from 'uuid';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-rooms-form',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './manage-rooms-form.component.html',
  styleUrl: './manage-rooms-form.component.scss'
})

export class ManageRoomsFormComponent implements OnInit {

  constructor(
    private api:ApiService,
    private message:MessageService,
    private router:Router,
    private activatedRoute:ActivatedRoute,
  ){}

  room:Room = {
    id: '',
    title: '',
    address: '',
    price: 0,
    rating: 0
  };

  id:string = "";
  editmode:boolean = false;

  addRoom(){
    let data = {
      id: uuid(),
      title: this.room.title,
      address: this.room.address,
      price: this.room.price,
      phone: this.room.phone,
      email: this.room.email,
      description: this.room.description,
      rating: 0
    }
    this.api.insert('accomodations', data).subscribe(res => {
      if (res){
        this.message.showMessage('OK', 'Szállás felvéve!', 'success');
        this.router.navigate(['/admin/rooms']);
      }
    })
  }

  updateRoom(){
    let data = {
      title: this.room.title,
      address: this.room.address,
      price: this.room.price,
      phone: this.room.phone,
      email: this.room.email,
      description: this.room.description,
    }
    this.api.update('accomodations', this.room.id, data).subscribe(res => {
      if (res){
        this.message.showMessage('OK', 'Szállás módosítva!', 'success');
        this.router.navigate(['/admin/rooms']);
      }
    })
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.getRoom();
  }

  getRoom(){
    if (this.id){
      this.editmode = true;
      this.api.select('accomodations', 'id', 'eq', this.id).subscribe((res:any) =>{
        if (res){
          this.room = {
            id: res[0].id,
            title: res[0].title,
            address: res[0].address,
            price: res[0].price,
            description: res[0].description,
            email: res[0].email,
            phone: res[0].phone,
            rating: res[0].rating
          };
        }
      });
    }
  }
}

