import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';
import { Booking } from '../../interfaces/booking';
import moment from 'moment';
import { Accomodation } from '../../interfaces/accomodation';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})

export class BookingsComponent implements OnInit{
  constructor(
    private api:ApiService,
    private auth:AuthService,
    private message:MessageService
  ){}

  loggeUser:User = {
    id: '',
    name: '',
    email: '',
    passwd: '',
    confirm: '',
    role: ''
  };

  bookings:Booking[] = [];
  accoms:Accomodation[] = [];

  ngOnInit(): void {
    this.getAccomodations();

    this.loggeUser = this.auth.loggedUser();

    this.getBookings();


  }

  getAccomodations(){
    this.api.selectAll('accomodations').subscribe(res => {
      this.accoms = res as Accomodation[];
    })
  }

  getBookings(){
    this.api.select('bookings', 'userID', 'eq', this.loggeUser.id).subscribe((res:any) => {

      if (res) {
        this.bookings = res as Booking[];

        this.bookings.forEach(booking => {
            booking.bookingDate = moment(booking.bookingDate).format('YYYY-MM-DD');
            booking.startDate = moment(booking.startDate).format('YYYY-MM-DD');
            booking.endDate = moment(booking.endDate).format('YYYY-MM-DD');
  
            booking.accomName = this.accoms.find(item => item.id == booking.accomID)!.title;
            booking.accomAddr = this.accoms.find(item => item.id == booking.accomID)!.address;
        });
      }

    })
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
