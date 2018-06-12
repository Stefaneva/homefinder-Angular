import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

@Component({
  selector: 'app-add-details',
  templateUrl: './add-details.component.html',
  styleUrls: ['./add-details.component.css']
})
export class AddDetailsComponent implements OnInit {

  images: string[] = [];
  private readonly imageType: string = 'data:image/PNG;base64,';
  lat = 0;
  lng = 0;
  zoom = 15;

  constructor(public userService: UserService,
              private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.spinnerService.show();
    this.lat = this.userService.adDetails.lat;
    this.lng = this.userService.adDetails.lng;
    console.log(this.userService.adDetails.id);
    this.userService.getAdImages(this.userService.adDetails.id).subscribe(
      (response) => {
        this.images = response;
        for (let i = 0; i < this.images.length; i++) {
          this.images[i] = this.imageType + this.images[i];
        }
        this.spinnerService.hide();
        console.log(this.images);
      }
    );
  }

}
