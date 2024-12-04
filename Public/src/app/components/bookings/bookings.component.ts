import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';
import { Bookings } from '../../interfaces/booking';
import moment from 'moment';
import { Accomodation } from '../../interfaces/accom';


@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class BookingsComponent implements OnInit {
  constructor(
    private api:ApiService,
    private auth:AuthService,

  ){}

  loggedUser:User = {
    id:'',
    name:'',
    email:'',
    passwd:'',
    confirm:'',
    role:''
  };

  bookings:Bookings[] = [];
  accoms:Accomodation[] = [];

  ngOnInit(): void {
    this.getAccomoditaions();


    this.loggedUser = this.auth.loggedUser();
    
    this.api.select('bookings', 'userID', 'eq', this.loggedUser.id).subscribe(res=>{
      this.bookings = res as Bookings[];

      this.bookings.forEach(booking=>{
        booking.bookingDate = moment(booking.bookingDate).format('YYYY-MM-DD');
        booking.startDate = moment(booking.startDate).format('YYYY-MM-DD');
        booking.endDate = moment(booking.endDate).format('YYYY-MM-DD');

        booking.accomName = this.accoms.find(item=> item.id == booking.accomID)!.title;
        booking.accomAddr = this.accoms.find(item=> item.id == booking.accomID)!.adress;
      }) 
    })
  }

  getAccomoditaions(){
    this.api.selectAll('accomodations').subscribe(res=>{
      this.accoms = res as Accomodation[];
    })
  }
}
