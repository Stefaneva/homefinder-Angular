import { Component, OnInit } from '@angular/core';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AdDto} from '../add/adDto';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  private readonly imageType: string = 'data:image/PNG;base64,';

  constructor(public userService: UserService,
              private spinnerService: Ng4LoadingSpinnerService,
              private router: Router,
              private dialog: MatDialog,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userService.getFavoriteAds().subscribe(
      response => {
        this.userService.favoriteAds = response;
        this.userService.favoriteAds.forEach( ad => ad.image = this.imageType + ad.image);
        console.log(response);
      }
    );
  }

  viewAdDetails(ad: AdDto) {
    this.userService.adDetails = ad;
    this.router.navigate(['/AdDetails', ad.id]);
  }

  deleteAd(ad: AdDto) {
    const index = this.userService.favoriteAds.indexOf(ad);
    this.userService.favoriteAds.splice(index, 1);
    this.userService.deleteFavoriteAd(ad.id).subscribe(
      result => this.snackBar.open('Anuntul a fost sters!', 'OK', {duration: 5000})
    );
  }

}
