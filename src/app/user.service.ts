import {ElementRef, EventEmitter, Injectable, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {User} from './models/user';
import {AuthService} from './auth/auth.service';
import {UserDto} from './models/userDto';
import {AdDto} from './add/adDto';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AdDetailsDto} from './models/adDetails';
import {AdDtoBin} from './models/adDtoBin';
import {FavoriteDto} from './models/favoriteDto';
import {MatSidenav} from '@angular/material';
import {ReviewDtoResponse} from './models/reviewDtoResponse';
import {ReviewDtoRequest} from './models/reviewDtoRequest';
import {UserDtoUpdate} from './models/userDtoUpdate';
import {EventDto} from './models/event';
import {EventDate} from './models/eventDate';
import {FormGroup} from '@angular/forms';


@Injectable()
export class UserService {
  closeDialog = new EventEmitter<boolean>();

  private _BASE_URL = 'https://home--finder.herokuapp.com';
  private _USERS_URL = this._BASE_URL + '/userList';
  private _USER_DATA_URL = this._BASE_URL + '/getUserData';
  private _UPDATE_USER_DATA = this._BASE_URL + '/updateUserData';
  private _NEW_AD_URL_IMAGES = this._BASE_URL + '/newAdImages';
  private _NEW_AD_URL_INFO = this._BASE_URL + '/newAdInfo';
  private _GET_ADS_WITH_IMAGES = this._BASE_URL + '/adsWithImages';
  private _GET_AD_IMAGES = this._BASE_URL + '/getAdImages';
  private _GET_AD_DETAILS = this._BASE_URL + '/getAdInfo';
  private _GET_USER_ADS = this._BASE_URL + '/getUserAds';
  private _DELETE_AD = this._BASE_URL + '/deleteAd';
  private _REPLACE_AD_IMAGES = this._BASE_URL + '/replaceAdImages';
  private _REPLACE_AD_INFO = this._BASE_URL + '/replaceAdInfo';
  private _GET_FAVORITE_ADS = this._BASE_URL + '/getFavoriteAds';
  private _SAVE_FAVORITE_AD = this._BASE_URL + '/saveFavorite';
  private _DELETE_FAVORITE_AD = this._BASE_URL + '/deleteFavorite';
  private _GET_AD_REVIEW =  this._BASE_URL + '/getAdReviews';
  private _SAVE_AD_REVIEW =  this._BASE_URL + '/saveAdReview';
  private _EDIT_REVIEW = this._BASE_URL + '/updateAdReview';
  private _DELETE_REVIEW = this._BASE_URL + '/deleteAdReview';
  private _GET_USER_EMAILS = this._BASE_URL + '/getUserEmails';
  private _GET_AD_EVENTS = this._BASE_URL + '/getAdEvents';
  private _GET_USER_EVENTS = this._BASE_URL + '/getUserEvents';
  private _SAVE_EVENT = this._BASE_URL + '/saveEvent';
  private _UPDATE_EVENT = this._BASE_URL + '/updateEvent';
  private _DELETE_EVENT = this._BASE_URL + '/deleteEvent';

  data: Object;
  page: number;
  itemsOnPage = 5;
  currentUser = new User;
  public ads: AdDto[] = [];
  public adDetails: AdDto;
  public adDetailsCalendar: AdDto;
  adDeleted = new AdDto();
  public myAds: AdDto[] = [];
  public favoriteAds: AdDto[] = [];
  // vars for sidenav
  term: any;
  priceMin: number;
  priceMax: number;
  saleCheckbox = false;
  rentCheckbox = false;
  adItemType: string;
  surfaceMin: number;
  surfaceMax: number;
  roomsMin: number;
  roomsMax: number;
  itemsPerPageOptions = [5, 7, 10];
  furnished: string;
  yearBuiltMin: number;
  yearBuiltMax: number;
  partitioning: string;
  comfort: number;
  floorLevelMin: number;
  floorLevelMax: number;
  areaSurfaceMin: number;
  areaSurfaceMax: number;
  sidenav: MatSidenav;
  searchLocation: FormGroup;
  searchElementRef: ElementRef;
  searchLat: number;
  searchLng: number;
  // vars for callendar
  userCalendar: boolean;
  eventsCalendar: EventDto[] = [];
  userEvent: boolean;

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  getUsers(): Observable<any> {
    return this.http.get(this._USERS_URL);
  }

  postUserData(): Observable<UserDto> {
    return this.http.post<UserDto>(this._USER_DATA_URL, {email: this.currentUser.email});
  }

  updateUserData(data: UserDtoUpdate): Observable<void> {
    return this.http.post<void>(this._UPDATE_USER_DATA, data);
  }

  getAdImages(adId: number): Observable<string[]> {
    return this.http.post<string[]>(this._GET_AD_IMAGES, adId);
  }

  postNewAdImages(data: FormData): Observable<void> {
    const headerPost = new HttpHeaders({'Content-Type': 'multipart/form-data'});
    return this.http.post<void>(this._NEW_AD_URL_IMAGES, data);
  }

  replaceAdImages(data: FormData): Observable<void> {
    return this.http.post<void>(this._REPLACE_AD_IMAGES, data);
  }

  replaceAdInfo(data: AdDto): Observable<void> {
    return this.http.post<void>(this._REPLACE_AD_INFO, data);
  }

  replaceAdLatLng(data: AdDto) {
    return this.http.post<void>(this._REPLACE_AD_INFO, data);
  }

  getAdsWithImages(): Observable<AdDto[]> {
    return this.http.get<AdDto[]>(this._GET_ADS_WITH_IMAGES);
  }

  getFavoriteAds(): Observable<AdDto[]> {
    return this.http.post<AdDto[]>(this._GET_FAVORITE_ADS, {email: this.currentUser.email});
  }

  saveFavorite(favoriteDto: FavoriteDto): Observable<void> {
    return this.http.post<void>(this._SAVE_FAVORITE_AD, favoriteDto);
  }

  deleteFavoriteAd(favoriteId: number): Observable<void> {
    return this.http.post<void>(this._DELETE_FAVORITE_AD, favoriteId);
  }

  getUserAds(): Observable<AdDto[]> {
    return this.http.post<AdDto[]>(this._GET_USER_ADS, {email: this.currentUser.email});
  }

  getAdInfo(adId: number): Observable<AdDetailsDto> {
    return this.http.post<AdDetailsDto>(this._GET_AD_DETAILS, adId);
  }

  deleteAd(adId: number): Observable<void> {
    return this.http.post<void>(this._DELETE_AD, adId);
  }

  getReviews(adId: number): Observable<ReviewDtoRequest[]> {
    return this.http.post<ReviewDtoRequest[]>(this._GET_AD_REVIEW, adId);
  }

  saveReview(review: ReviewDtoResponse): Observable<void> {
    return this.http.post<void>(this._SAVE_AD_REVIEW, review);
  }

  editReview(review: ReviewDtoResponse): Observable<void> {
    return this.http.post<void>(this._EDIT_REVIEW, review);
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.post<void>(this._DELETE_REVIEW, reviewId);
  }

  getUserEmails(): Observable<string[]> {
    return this.http.get<string[]>(this._GET_USER_EMAILS);
  }

  getAdEvents(adId: number): Observable<EventDto[]> {
    return this.http.post<EventDto[]>(this._GET_AD_EVENTS, adId);
  }

  getUserEvents(): Observable<EventDto[]> {
    return this.http.post<EventDto[]>(this._GET_USER_EVENTS, {email: this.currentUser.email});
  }

  saveEvent(eventDto: EventDate): Observable<void> {
    return this.http.post<void>(this._SAVE_EVENT, eventDto);
  }

  updateEvent(eventDto: EventDate): Observable<void> {
    return this.http.post<void>(this._UPDATE_EVENT, eventDto);
  }

  deleteEvent(eventDto: EventDate): Observable<void> {
    return this.http.post<void>(this._DELETE_EVENT, eventDto);
  }
}
