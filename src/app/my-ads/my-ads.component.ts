import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {AddDto} from '../add/addDto';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {Router} from '@angular/router';
import {NgxSmartModalService} from 'ngx-smart-modal';
import {MatDialog} from '@angular/material';
import {SigninComponent} from '../auth/signin/signin.component';
import {ModalAgreementComponent} from '../modal-agreement/modal-agreement.component';

@Component({
  selector: 'app-my-ads',
  templateUrl: './my-ads.component.html',
  styleUrls: ['./my-ads.component.css']
})
export class MyAdsComponent implements OnInit {

  private readonly imageType: string = 'data:image/PNG;base64,';

  constructor(public userService: UserService,
              private spinnerService: Ng4LoadingSpinnerService,
              private router: Router,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.spinnerService.show();
    this.userService.getUserAds().subscribe(
      response => {
        this.userService.myAds = response;
        this.userService.myAds.forEach( ad => ad.image = this.imageType + ad.image);
        this.spinnerService.hide();
      }
    );
  }

  viewAdDetails(ad: AddDto) {
    this.userService.adDetails = ad;
    this.router.navigate(['/AdDetails', ad.id]);
  }

  deleteAd(ad: AddDto) {
    this.userService.adDeleted = ad;
    this.userService.closeDialog.subscribe(result => this.dialog.closeAll());
    const dialogRef = this.dialog.open(ModalAgreementComponent, {});
      // const index = this.myAds.indexOf(ad);
      // this.myAds.splice(index, 1);
      // this.userService.deleteAd(ad.id).subscribe(
      //   result => {
      //     console.log(result);
      //   }
      // );
    }
}
