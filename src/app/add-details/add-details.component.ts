import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../user.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {AdDto} from '../add/adDto';
import {MapsAPILoader} from '@agm/core';
import {FormControl, FormGroup} from '@angular/forms';
import * as FileSaver from 'file-saver';
import {DomSanitizer} from '@angular/platform-browser';
import {FavoriteDto} from '../models/favoriteDto';
import {MatSnackBar} from '@angular/material';
import {ReviewDtoRequest} from '../models/reviewDtoRequest';
import {ReviewDtoResponse} from '../models/reviewDtoResponse';

@Component({
  selector: 'app-add-details',
  templateUrl: './add-details.component.html',
  styleUrls: ['./add-details.component.css']
})
export class AddDetailsComponent implements OnInit {

  images: string[] = [];
  imgBase64: string[] = [];
  private readonly imageType: string = 'data:image/PNG;base64,';
  lat = 0;
  lng = 0;
  address: string;
  zoom = 15;
  panelOpenState = false;
  adId: number;
  step = 0;
  adDetailsChanges: AdDto = new AdDto();
  changeLocation = false;
  newLocation: FormGroup;
  hidden = true;
  adUserPhone: number;
  addDto: AdDto = new AdDto();
  myFiles: File [] = [];
  reviews: ReviewDtoRequest[] = [];
  rating = 0;
  comment: string;
  reviewsDates: Date[] = [];
  editReview = false;
  reviewChanges: ReviewDtoRequest;

  @ViewChild('search')
  searchElementRef: ElementRef;

  constructor(public userService: UserService,
              private spinnerService: Ng4LoadingSpinnerService,
              private ngZone: NgZone,
              private mapsAPILoader: MapsAPILoader,
              private route: ActivatedRoute,
              public domSanitizer: DomSanitizer,
              public snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit() {
    this.userService.adDetails = new AdDto();
    this.spinnerService.show();
    this.route.params.subscribe( params => {
      this.adId = parseInt(params['id'], 10);
      // this.userService.adDetails.id = parseInt(this.adId, 10);
    } );
    this.userService.getAdInfo(this.adId).subscribe(
      response1 => {
        this.adDetailsChanges.id = response1.id;
        this.adDetailsChanges.title = response1.title;
        this.adDetailsChanges.description = response1.description;
        this.adDetailsChanges.adItemType = response1.adItemType;
        this.adDetailsChanges.adType = response1.adType;
        this.adDetailsChanges.surface = response1.surface;
        this.adDetailsChanges.rooms = response1.rooms;
        this.adDetailsChanges.price = response1.price;
        this.adDetailsChanges.lat = response1.lat;
        this.adDetailsChanges.lng = response1.lng;
        this.adDetailsChanges.partitioning = response1.partitioning;
        this.adDetailsChanges.comfort = response1.comfort;
        this.adDetailsChanges.furnished = response1.furnished;
        this.adDetailsChanges.floorLevel = response1.floorLevel;
        this.adDetailsChanges.areaSurface = response1.areaSurface;
        this.adDetailsChanges.yearBuilt = response1.yearBuilt;
        this.adDetailsChanges.userEmail = response1.userDetails.mail;
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
        this.adUserPhone = response1.userDetails.phone;
        this.lat = this.userService.adDetails.lat;
        this.lng = this.userService.adDetails.lng;
    console.log(this.userService.adDetails.id);
    // Location
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
        this.userService.getAdImages(this.adId).subscribe(
          (response) => {
            this.images = response;
            this.imgBase64 = response;
            this.adDetailsChanges.image = this.images[0];
            for (let i = 0; i < this.images.length; i++) {
              this.images[i] = this.imageType + this.images[i];
            }
            this.spinnerService.hide();
            console.log(this.images);
          }
        );
      }
    );
    this.userService.getReviews(this.adId).subscribe(
        response => {
          this.reviews = response;
          console.log(this.reviews);
          let i = 0;
          this.reviews.forEach(
            review => {
              this.reviewsDates[i++] = new Date(review.date);
              if (review.userType === 'AGENT_IMOBILIAR') {
                review.userType = 'Agent Imobiliar';
              } else {
                review.userType = 'Utilizator';
              }
            }
          );
        }
    );
    this.newLocation = new FormGroup({
      'searchControl' : new FormControl(null)
    });
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        // types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {

          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          // set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 16;
          this.changeLocation = true;
        });
      });
    });
  }

  setStep(indexx: number) {
    this.panelOpenState = true;
    this.step = indexx;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  saveChanges(step: number) {
    this.userService.adDetails = this.adDetailsChanges;
    this.spinnerService.show();
    this.userService.replaceAdInfo(this.adDetailsChanges).subscribe(
      response => {
        console.log(response);
        this.spinnerService.hide();
      }
    );
  }

  cancelChanges(step: number) {
    if (step === 1) {
      this.adDetailsChanges.description = this.userService.adDetails.description;
    }
    if (step === 2) {
      this.adDetailsChanges = this.userService.adDetails;
    }
  }

  onChoseLocation(event) {
    if (this.changeLocation === true) {
      this.lat = event.coords.lat;
      this.lng = event.coords.lng;
      this.changeLocation = false;
    }
  }

  changeTheLocation() {
    this.changeLocation = true;
    this.hidden = false;
  }

  cancelLocationChanges() {
    this.lat = this.adDetailsChanges.lat;
    this.lng = this.adDetailsChanges.lng;
    this.changeLocation = false;
    this.hidden = true;
    this.newLocation.get('searchControl').setValue(null);
  }

  saveLocationChanges() {
    this.userService.adDetails = this.adDetailsChanges;
    this.spinnerService.show();
    this.userService.replaceAdInfo(this.adDetailsChanges).subscribe(
      response => {
        console.log(response);
        this.spinnerService.hide();
      }
    );
  }

  saveImages() {
    const imageName = 'image';
    let imageNumber = 1;
    this.imgBase64.forEach(image => {
      const res = image.slice(22, image.length);
      const byteCharacters = atob(res);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'image/png'});
      FileSaver.saveAs(blob, imageName + imageNumber);
      imageNumber++;
    });
  }

  replaceImages() {
    this.images.length = 0;
    const input   = document.getElementById('fileInput');
    input.click();
  }

  getFileDetails (e) {
    for (let i = 0; i < e.target.files.length; i++) {
      const uploadedFile = e.target.files[i];
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(uploadedFile);
      this.myFiles.push(e.target.files[i]);
    }
    const frmData = new FormData();
    frmData.append('adId', this.adDetailsChanges.id.toString());
    for (let i = 0; i < this.myFiles.length; i++) {
      frmData.append('fileUpload', this.myFiles[i]);
    }
    console.log(this.images);
    this.userService.replaceAdImages(frmData).subscribe(
      response => {
        console.log(response);
      }
    );
  }

  handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.images.push('data:image/PNG;base64,' + btoa(binaryString));
  }

  saveFavorite() {
    if (this.userService.currentUser.token) {
      const favorite: FavoriteDto = new FavoriteDto();
      favorite.adId = this.userService.adDetails.id;
      favorite.userEmail = this.userService.currentUser.email;
      this.userService.saveFavorite(favorite).subscribe(
        response => {
          console.log(response);
          this.snackBar.open('Anuntul a fost adaugat la favorite!', 'OK', {duration: 5000});
          this.userService.getFavoriteAds().subscribe(
            result => {
              this.userService.favoriteAds = result;
              this.userService.favoriteAds.forEach( ad => ad.image = this.imageType + ad.image);
            }
          );
        }
      );
    } else {
      this.snackBar.open('Intra in cont pentru a adauga anuntul la favorite!', 'OK', {duration: 5000});
    }
  }

  googleMapsDirection() {
    const url: string = 'http://maps.google.com/maps?q=' + this.lat + ',' + this.lng;
    window.open(url);
  }

  addReview() {
    if (!this.userService.currentUser.token) {
      this.snackBar.open('Intra in cont pentru a adauga un review!', 'Ok', {duration: 5000});
      return;
    }
    for (const review1 of this.reviews) {
          if (review1.mail === this.userService.currentUser.email) {
            this.snackBar.open('Ati adaugat un review deja!', 'Ok', {duration: 5000});
            return;
          }
    }
    const reviewNewArrayElement = new ReviewDtoRequest();
    const review = new ReviewDtoResponse();
    review.adId = this.adDetailsChanges.id;
    review.mail = this.userService.currentUser.email;
    review.comment = this.comment;
    review.rating = this.rating;
    reviewNewArrayElement.idReview = this.reviews[this.reviews.length - 1].idReview + 1;
    reviewNewArrayElement.mail = review.mail;
    reviewNewArrayElement.comment = review.comment;
    reviewNewArrayElement.rating = review.rating;
    reviewNewArrayElement.date = new Date().toDateString();
    reviewNewArrayElement.username = this.userService.currentUser.name;
    reviewNewArrayElement.userType = this.userService.currentUser.type;
    this.userService.saveReview(review).subscribe(
      result => console.log(result)
    );
    this.reviews.splice(0, 0, reviewNewArrayElement);
  }

  editUserReview(review: ReviewDtoRequest) {
    this.editReview = true;
    this.reviewChanges = review;
  }

  deleteUserReview(review: ReviewDtoRequest) {
    const index = this.reviews.indexOf(review);
    this.reviews.splice(index, 1);
    this.userService.deleteReview(review.idReview).subscribe(
      result => {
        console.log(result);
        this.snackBar.open('Review-ul a fost sters!', 'Ok', {duration: 5000});
      }
    );
  }

  editUserReviewSave(review: ReviewDtoRequest) {
    const index = this.reviews.indexOf(review);
    this.reviews[index].comment = this.reviewChanges.comment;
    this.reviews[index].rating = this.reviewChanges.rating;
    const reviewResponse = new ReviewDtoResponse();
    reviewResponse.idReview = this.reviewChanges.idReview;
    reviewResponse.rating = this.reviewChanges.rating;
    reviewResponse.comment = this.reviewChanges.comment;
    reviewResponse.like = this.reviewChanges.like;
    console.log(reviewResponse.idReview);
    this.userService.editReview(reviewResponse).subscribe(
      response => {
        console.log(response);
        this.snackBar.open('Modificarile au fost salvate!', 'Ok', {duration: 5000});
      }
    );
    this.editReview = false;
  }

  editReviewCancel(review: ReviewDtoRequest) {
    this.reviewChanges = review;
    this.editReview = false;
  }

  calendarRedirect() {
    this.userService.adDetailsCalendar = this.userService.adDetails;
    this.userService.userCalendar = false;
    this.router.navigateByUrl('/calendar');
  }
}

