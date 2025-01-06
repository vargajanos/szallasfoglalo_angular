import { Component, OnInit } from '@angular/core';
import { Room } from '../../interfaces/room';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MessageService } from '../../services/message.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from 'uuid';

@Component({
  selector: 'app-manage-room-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './manage-room-form.component.html',
  styleUrl: './manage-room-form.component.scss'
})
export class ManageRoomFormComponent implements OnInit{

  constructor(
    private api:ApiService,
    private message:MessageService,
    private router:Router,
    private activatedRoute:ActivatedRoute
  ){}

  room:Room={
    id:'',
    title:'',
    address:'',
    price:0,
    rating:0
  }

  id:string = "";

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id) {
      this.api.select("accomodations", "id", "eq", this.id).subscribe((res:any)=>{
        this.room = res[0] as Room;
      })
    }
  }

  addRoom(){

    let data = {
      id: uuid.v4(),
      title: this.room.title,
      address: this.room.address,
      phone: this.room.phone,
      email:this.room.email,
      price: this.room.price,
      rating: this.room.rating,
      description: this.room.description
    }

    this.api.insert('accomodations', data).subscribe(res=>{
      if (res) {
        this.message.showMessage('OK', 'Szállás felvéve', 'success');
        this.router.navigate(['/admin/rooms'])
      }
    })
  }
}
