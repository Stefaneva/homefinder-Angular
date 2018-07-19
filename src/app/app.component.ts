import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from './user.service';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Change';

  @ViewChild('sidenav') mySidenav: MatSidenav;

  constructor(public userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.sidenav = this.mySidenav;
  }

  resetFilters() {
    this.userService.adItemType = null;
    this.userService.rentCheckbox = false;
    this.userService.saleCheckbox = false;
    this.userService.priceMin = null;
    this.userService.priceMax = null;
    this.userService.surfaceMin = null;
    this.userService.surfaceMax = null;
    this.userService.roomsMin = null;
    this.userService.roomsMax = null;
    this.userService.furnished = null;
    this.userService.yearBuiltMin = null;
    this.userService.yearBuiltMax = null;
    this.userService.partitioning = null;
    this.userService.comfort = null;
    this.userService.floorLevelMin = null;
    this.userService.floorLevelMax = null;
    this.userService.areaSurfaceMin = null;
    this.userService.areaSurfaceMax = null;
  }
}
