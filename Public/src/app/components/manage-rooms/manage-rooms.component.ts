import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Room } from '../../interfaces/room';
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
export class ManageRoomsComponent implements OnInit {

  constructor(private api:ApiService,
    private message:MessageService

  ){}

  rooms:Room[] = []; 

  ngOnInit(): void {
    this.getRooms()
  }

  getRooms(){
    this.api.selectAll("accomodations").subscribe(res=>{
      this.rooms = res as Room[];
    })
  }

  deleteRoom(id:any){
    if (confirm("Kinki?")) {
      this.api.delete('accomodations', id).subscribe(res=>{
        this.message.showMessage("OK", "Törölve", "success")
        this.getRooms();
      });
    }
  }
}
