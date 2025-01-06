import { Component } from '@angular/core';
import { Accomodation } from '../../interfaces/accomodation';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent {
  constructor(
    private api:ApiService,
    private auth:AuthService,
    private message:MessageService
  ){}


  users:User[] = [];
  accoms:Accomodation[] = [];

  ngOnInit(): void {
    this.getAccomodations();

    this.getUsers();


  }

  getAccomodations(){
    this.api.selectAll('accomodations').subscribe(res => {
      this.accoms = res as Accomodation[];
    })
  }

  getUsers(){
    this.api.selectAll('users').subscribe(res => {
      this.users = res as User[];

    });
  }

  Torles(id:any){
    if (confirm("Biztos törlöd?")) {
      this.api.delete('users', id).subscribe((res:any)=>{
        this.message.showMessage("OK", "Sikeres user törlés", "success")
        this.getUsers();
      })
    }
    else{
      return;
    }
  }
}
