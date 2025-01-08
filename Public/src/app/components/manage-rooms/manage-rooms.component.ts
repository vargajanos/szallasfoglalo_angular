import { Component, OnInit } from '@angular/core';
import { Room } from '../../interfaces/room';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-manage-rooms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manage-rooms.component.html',
  styleUrl: './manage-rooms.component.scss'
})

export class ManageRoomsComponent implements OnInit{

  rooms:Room[] = [];

  constructor(
    private api:ApiService,
    private message:MessageService
  ){}

  ngOnInit(): void {
    this.getAccomodations();
  }

  deleteRoom(id:string){
    if (confirm('Biztosan törlöd a kiválasztott szállást? A hozzá kapcsolódó foglalások is törlésre kerülnek!')){
      this.api.delete('accomodations', id).subscribe(res =>{
        this.message.showMessage('OK', 'A kiválaszottt szállás törölve lett!', 'success');
        this.getAccomodations();
      });
    }
  }

  getAccomodations(){
    this.api.selectAll('accomodations').subscribe(res => {
      this.rooms = res as Room[];
    })
  }
}
