import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../user.service';
import {AuthService} from '../auth/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MapsAPILoader} from '@agm/core';
import {} from '@types/googlemaps';
import {AdDto} from './adDto';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  addNewAdForm: FormGroup;
  imageType = 'data:image/PNG;base64,';
  lat = 51.678418;
  lng = 7.809007;
  zoom: number;
  locationChosen = false;
  myFiles: File [] = [];
  sMsg = '';
  base64String: string;
  adSuggestedMinPrice = Number.MAX_SAFE_INTEGER;
  adSuggestedMaxPrice = 0;
  suggestedPrice: number;
  addDto: AdDto = new AdDto();
  address: string;

  @ViewChild('search')
  searchElementRef: ElementRef;

  constructor(private userService: UserService,
              private authService: AuthService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private spinnerService: Ng4LoadingSpinnerService, ) { }

  ngOnInit() {
    this.addNewAdForm = new FormGroup({
      'title' : new FormControl(null, Validators.required),
      'adType' : new FormControl('Inchiriere', Validators.required),
      'description' : new FormControl(null, Validators.required),
      'price' : new FormControl(null, Validators.required),
      'surface' : new FormControl(null, Validators.required),
      'rooms' : new FormControl(null, Validators.required),
      'adItemType' : new FormControl(null, Validators.required),
      'searchControl' : new FormControl(null),
      'partitioning' : new FormControl(null, Validators.required),
      'comfort' : new FormControl(null, Validators.required),
      'floorLevel' : new FormControl(null, Validators.required),
      'furnished' : new FormControl(null, Validators.required),
      'areaSurface' : new FormControl(null, Validators.required),
      'yearBuilt' : new FormControl(null, Validators.required)
    });

    this.zoom = 4;
    this.lat = 39.8282;
    this.lng = -98.5795;

    this.setCurrentPosition();


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
          this.locationChosen = true;
          // Location
          const geocoder = new google.maps.Geocoder();
          const latlng = new google.maps.LatLng(this.lat, this.lng);
          const request = {
            location: latlng
          };
          geocoder.geocode(request, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
              if (results[0] != null) {
                this.addDto.location = results[0].formatted_address;
                console.log(this.addDto.location);
              }
            }
          });
          // price Suggestion
          const locationLatLng = new google.maps.LatLng(this.lat, this.lng);
          // let adNumber = 0;
          this.adSuggestedMaxPrice = 0;
          this.adSuggestedMinPrice = Number.MAX_SAFE_INTEGER;
          if (this.addNewAdForm.get('adItemType').value) {
            const adItemType = this.addNewAdForm.get('adItemType').value;
            const adType = this.addNewAdForm.get('adType').value;
            for (const i of this.userService.ads) {
              const adLocation = new google.maps.LatLng(i.lat, i.lng);
              const distanceInKm = google.maps.geometry.spherical.computeDistanceBetween(locationLatLng, adLocation) / 1000;
              console.log(distanceInKm);
              if (i.adItemType === adItemType && distanceInKm <= 1.0 && i.adType === adType) {
                // this.adSuggestedMinPrice = this.adSuggestedMinPrice + i.price;
                // adNumber++;
                if (this.adSuggestedMinPrice > i.price) {
                  this.adSuggestedMinPrice = i.price;
                }
                if (this.adSuggestedMaxPrice < i.price) {
                  this.adSuggestedMaxPrice = i.price;
                }
              }
            }
          }
        });
      });
    });

    this.onChanges();
  }

  onChanges(): void {
    // this.addNewAdForm.get('adItemType').valueChanges.subscribe(
    //   val => {
    //
    //   }
    // );
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 16;
      });
    }
  }

  onSubmit() {
    console.log(this.addNewAdForm);
    this.userService.closeDialog.emit(true);
    const frmData = new FormData();
    for (let i = 0; i < this.myFiles.length; i++) {
      frmData.append('fileUpload', this.myFiles[i]);
    }
    this.addDto.title = this.addNewAdForm.value.title;
    this.addDto.description = this.addNewAdForm.value.description;
    this.addDto.adItemType = this.addNewAdForm.value.adItemType;
    this.addDto.adType = this.addNewAdForm.value.adType;
    this.addDto.price = this.addNewAdForm.value.price;
    this.addDto.rooms = this.addNewAdForm.value.rooms;
    this.addDto.surface = this.addNewAdForm.value.surface;
    this.addDto.lat = this.lat;
    this.addDto.lng = this.lng;
    this.addDto.userEmail = this.userService.currentUser.email;
    // this.userService.ads.splice(0, 0 , this.addDto);
    frmData.append('title', this.addNewAdForm.value.title);
    frmData.append('description', this.addNewAdForm.value.description);
    frmData.append('adItemType', this.addNewAdForm.value.adItemType);
    if (this.addNewAdForm.value.adItemType === 'Casa') {
      this.addNewAdForm.get('comfort').setValue(0);
      this.addNewAdForm.get('floorLevel').setValue(0);
      this.addNewAdForm.get('partitioning').setValue(null);
      this.addNewAdForm.get('furnished').setValue(null);
    } else {
      this.addNewAdForm.get('areaSurface').setValue(0);
    }
    frmData.append('adType', this.addNewAdForm.value.adType);
    frmData.append('price', this.addNewAdForm.value.price);
    frmData.append('rooms', this.addNewAdForm.value.rooms);
    frmData.append('surface', this.addNewAdForm.value.surface);
    frmData.append('lat', this.lat.toString());
    frmData.append('lng', this.lng.toString());
    frmData.append('userEmail', this.userService.currentUser.email);
    frmData.append('partitioning', this.addNewAdForm.value.partitioning);
    frmData.append('comfort', this.addNewAdForm.value.comfort);
    frmData.append('floorLevel', this.addNewAdForm.value.floorLevel);
    frmData.append('areaSurface', this.addNewAdForm.value.areaSurface);
    frmData.append('furnished', this.addNewAdForm.value.furnished);
    frmData.append('yearBuilt', this.addNewAdForm.value.yearBuilt);
    frmData.append('location', this.addDto.location);
    console.log(frmData.getAll('fileUpload'));
    console.log(frmData.get('location'));
    this.userService.postNewAdImages(frmData).subscribe(
      (response) => {
        console.log(response);
        this.spinnerService.show();
        this.userService.getAdsWithImages().subscribe(
          (response1) => {console.log(response1);
          this.userService.ads = response1;
          this.spinnerService.hide();
          this.userService.ads.forEach( ad => ad.image = this.imageType + ad.image);
          }
        );
      },
          (error) => console.log(error)
    );
  }

  onChoseLocation(event) {
    this.adSuggestedMaxPrice = 0;
    this.adSuggestedMinPrice = Number.MAX_SAFE_INTEGER;
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    this.locationChosen = true;
    // Location:
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(this.lat, this.lng);
    const request = {
      location: latlng
    };
    geocoder.geocode(request, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0] != null) {
          this.addDto.location = results[0].formatted_address;
          console.log(this.addDto.location);
        }
      }
    });
    const locationLatLng = new google.maps.LatLng(this.lat, this.lng);
    // let adNumber = 0;
    if (this.addNewAdForm.get('adItemType').value) {
      const adItemType = this.addNewAdForm.get('adItemType').value;
      const adType = this.addNewAdForm.get('adType').value;
      for (const i of this.userService.ads) {
        const adLocation = new google.maps.LatLng(i.lat, i.lng);
        const distanceInKm = google.maps.geometry.spherical.computeDistanceBetween(locationLatLng, adLocation) / 1000;
        console.log(distanceInKm);
        if (i.adItemType === adItemType && distanceInKm <= 1.0 && i.adType === adType) {
          if (this.adSuggestedMinPrice > i.price) {
            this.adSuggestedMinPrice = i.price;
          }
          if (this.adSuggestedMaxPrice < i.price) {
            this.adSuggestedMaxPrice = i.price;
          }
          // adNumber++;
        }
      }
      if (this.adSuggestedMaxPrice !== 0 && this.adSuggestedMinPrice === Number.MAX_SAFE_INTEGER) {
        this.adSuggestedMinPrice = this.adSuggestedMaxPrice;
      }
    }
  }


  getFileDetails (e) {
    console.log (e.target.files);
    const uploadedFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsBinaryString(uploadedFile);
    for (let i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }

  handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.addDto.image = 'data:image/PNG;base64,' + btoa(binaryString);
  }

  // Implement in on submit
  uploadFiles () {
    const frmData = new FormData();
    for (let i = 0; i < this.myFiles.length; i++) {
      frmData.append('fileUpload', this.myFiles[i]);
    }
  }

  validForm(): boolean {
    if (this.addNewAdForm.get('adItemType').value === 'Apartament') {
      return !(!this.addNewAdForm.get('price').valid || !this.addNewAdForm.get('title').valid
        || !this.addNewAdForm.get('description').valid ||
        !this.addNewAdForm.get('adType').valid || !this.addNewAdForm.get('rooms').valid || !this.addNewAdForm.get('surface').valid &&
        !this.addNewAdForm.get('partitioning').valid || !this.addNewAdForm.get('comfort').valid ||
        !this.addNewAdForm.get('floorLevel').valid || !this.addNewAdForm.get('yearBuilt').valid);
    }
    if (this.addNewAdForm.get('adItemType').value === 'Casa') {
      return !(!this.addNewAdForm.get('title').valid || !this.addNewAdForm.get('description').valid ||
        !this.addNewAdForm.get('adType').valid ||
        !this.addNewAdForm.get('rooms').valid || !this.addNewAdForm.get('surface').valid ||
        !this.addNewAdForm.get('yearBuilt').valid || !this.addNewAdForm.get('areaSurface').valid ||
        !this.addNewAdForm.get('furnished').valid || !this.addNewAdForm.get('price').valid);
    }
  }
}
