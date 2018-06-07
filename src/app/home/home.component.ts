import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {UserService} from '../user.service';
import {AddDto} from '../add/addDto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private readonly imageType: string = 'data:image/PNG;base64,';
  public image: any = [];
  // public ads: AddDto[] = [];

  constructor(private authService: AuthService,
              public userService: UserService) { }

  ngOnInit() {
    this.userService.getAdsWithImages().subscribe(
      (response) => {
        console.log(response);
        this.userService.ads = response;
        this.userService.ads.forEach( ad => ad.image = this.imageType + ad.image);
        // this.image = this.imageType + response.image;
      }
    );
  }
}
