import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {UserService} from '../user.service';
import {AddDto} from '../add/addDto';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {FilterPipe} from './FilterPipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private readonly imageType: string = 'data:image/PNG;base64,';
  public image: any = [];
  term: any;
  adItemType: string;
  // public ads: AddDto[] = [];

  constructor(private authService: AuthService,
              public userService: UserService,
              private spinnerService: Ng4LoadingSpinnerService,
              private router: Router) { }

  ngOnInit() {
    this.spinnerService.show();
    this.userService.getAdsWithImages().subscribe(
      (response) => {
        console.log(response);
        this.spinnerService.hide();
        this.userService.ads = response;
        this.userService.ads.forEach( ad => ad.image = this.imageType + ad.image);
      }
    );
  }

  viewAdDetails(ad: AddDto) {
    this.userService.adDetails = ad;
    const url = '/AdDetails/' + ad.id;
    // this.router.navigateByUrl('/AdDetails');
    this.router.navigate(['/AdDetails', ad.id]);
  }
}
