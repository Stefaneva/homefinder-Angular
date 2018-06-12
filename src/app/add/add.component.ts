import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../user.service';
import {AuthService} from '../auth/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MapsAPILoader} from '@agm/core';
import {} from '@types/googlemaps';
import {AddDto} from './addDto';


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
  addDto: AddDto = new AddDto();

  @ViewChild('search')
  searchElementRef: ElementRef;

  constructor(private userService: UserService,
              private authService: AuthService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) { }

  ngOnInit() {
    this.addNewAdForm = new FormGroup({
      'title' : new FormControl(null, Validators.required),
      'adType' : new FormControl('Inchiriere', Validators.required),
      'description' : new FormControl(null, Validators.required),
      'price' : new FormControl(null, Validators.required),
      'surface' : new FormControl(null, Validators.required),
      'rooms' : new FormControl(null, Validators.required),
      'adItemType' : new FormControl(null, Validators.required),
      'searchControl' : new FormControl(null)
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
        });
      });
    });
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
    frmData.append('adType', this.addNewAdForm.value.adType);
    frmData.append('price', this.addNewAdForm.value.price);
    frmData.append('rooms', this.addNewAdForm.value.rooms);
    frmData.append('surface', this.addNewAdForm.value.surface);
    frmData.append('lat', this.lat.toString());
    frmData.append('lng', this.lng.toString());
    frmData.append('userEmail', this.userService.currentUser.email);
    console.log(frmData.getAll('fileUpload'));
    this.userService.postNewAdImages(frmData).subscribe(
      (response) => {
        console.log(response);
        this.userService.getAdsWithImages().subscribe(
          (response1) => {console.log(response1); this.userService.ads = response1;
            this.userService.ads.forEach( ad => ad.image = this.imageType + ad.image);
          }
        );
      },
          (error) => console.log(error)
    );
  }

  onChoseLocation(event) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    this.locationChosen = true;
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
}
