import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Accomodation } from '../../interfaces/accomodation';
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import { Booking } from '../../interfaces/booking';
import moment from 'moment';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-manage-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-bookings.component.html',
  styleUrl: './manage-bookings.component.scss'
})
export class ManageBookingsComponent {
  constructor(
    private api:ApiService,
    private auth:AuthService,
    private message:MessageService
  ){}


  bookings:Booking[] = [];
  accoms:Accomodation[] = [];
  users:User[] = [];

  ngOnInit(): void {
    this.getAccomodations();
    this.getUsers();

    this.getBookings();


  }

  getAccomodations(){
    this.api.selectAll('accomodations').subscribe(res => {
      this.accoms = res as Accomodation[];
    })
  }

  getUsers(){
    this.api.selectAll('users').subscribe(res => {
      this.users = res as User[];
    })
  }

  getBookings(){
    this.api.selectAll('bookings').subscribe((res:any) => {
      if(res){
        this.bookings = res as Booking[];

        this.bookings.forEach(booking => {
          booking.bookingDate = moment(booking.bookingDate).format('YYYY-MM-DD');
          booking.startDate = moment(booking.startDate).format('YYYY-MM-DD');
          booking.endDate = moment(booking.endDate).format('YYYY-MM-DD');
  
          booking.accomName = this.accoms.find(item => item.id == booking.accomID)!.title;
          booking.accomAddr = this.accoms.find(item => item.id == booking.accomID)!.address;
          booking.userName = this.users.find(item => item.id == booking.userID)!.name;
      });
      }
    });
  }

  Lemondas(id:any){
    if (confirm("Biztos lemondod?")) {
      this.api.delete('bookings', id).subscribe((res:any)=>{
        this.message.showMessage("OK", "Sikeres lemondás", "success")
        this.getBookings();
      })
    }
    else{
      return;
    }
  }
}
