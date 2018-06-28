import {Component, NgZone, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {ActivatedRoute} from '@angular/router';
import {AddDto} from '../add/addDto';

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
  address;
  zoom = 15;
  time = {hour: 13, minute: 30};
  panelOpenState = false;
  adId: number;
  step = 0;

  constructor(public userService: UserService,
              private spinnerService: Ng4LoadingSpinnerService,
              private ngZone: NgZone,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.userService.adDetails = new AddDto();
    this.spinnerService.show();
    this.route.params.subscribe( params => {
      this.adId = parseInt(params['id'], 10);
      // this.userService.adDetails.id = parseInt(this.adId, 10);
    } );
    this.userService.getAdInfo(this.adId).subscribe(
      response1 => {
        console.log(response1);
        this.userService.adDetails.id = response1.id;
        this.userService.adDetails.title = response1.title;
        this.userService.adDetails.description = response1.description;
        this.userService.adDetails.adItemType = response1.adItemType;
        this.userService.adDetails.adType = response1.adType;
        this.userService.adDetails.surface = response1.surface;
        this.userService.adDetails.rooms = response1.rooms;
        this.userService.adDetails.price = response1.price;
        this.userService.adDetails.lat = response1.lat;
        this.userService.adDetails.lng = response1.lng;
        this.userService.adDetails.partitioning = response1.partitioning;
        this.userService.adDetails.comfort = response1.comfort;
        this.userService.adDetails.furnished = response1.furnished;
        this.userService.adDetails.floorLevel = response1.floorLevel;
        this.userService.adDetails.areaSurface = response1.areaSurface;
        this.userService.adDetails.yearBuilt = response1.yearBuilt;
        this.userService.adDetails.userEmail = response1.userDetails.mail;
        this.lat = this.userService.adDetails.lat;
        this.lng = this.userService.adDetails.lng;
    console.log(this.userService.adDetails.id);
    // this.userService.getAdImages(this.userService.adDetails.id).subscribe(
    this.userService.getAdImages(this.adId).subscribe(
      (response) => {
        this.images = response;
        for (let i = 0; i < this.images.length; i++) {
          this.images[i] = this.imageType + this.images[i];
        }
        this.spinnerService.hide();
        console.log(this.images);
        const geocoder = new google.maps.Geocoder();
        const latlng = new google.maps.LatLng(this.lat, this.lng);
        const request = {
          location: latlng
        };
        geocoder.geocode(request, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[0] != null) {
              this.address = results[0].formatted_address;
              console.log(this.address);
            }
          }
        });
      }
    );
      }
    );
  }

  setStep(index: number) {
    this.panelOpenState = true
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

}
