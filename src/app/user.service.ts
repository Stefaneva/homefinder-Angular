import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {User} from './models/user';
import {AuthService} from './auth/auth.service';
import {UserDto} from './models/userDto';
import {AddDto} from './add/addDto';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


@Injectable()
export class UserService {
  closeDialog = new EventEmitter<boolean>();

  private _BASE_URL = 'https://home--finder.herokuapp.com';
  private _USER_DATA_URL = this._BASE_URL + '/getUserData';
  private _NEW_AD_URL_IMAGES = this._BASE_URL + '/newAdImages';
  private _NEW_AD_URL_INFO = this._BASE_URL + '/newAdInfo';
  private _GET_ADS_WITH_IMAGES = this._BASE_URL + '/adsWithImages';
  private _GET_AD_IMAGES = this._BASE_URL + '/getAdImages';

  data: Object;
  page: number;
  currentUser = new User;
  public ads: AddDto[] = [];
  public adDetails: AddDto;

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  getUser(): Observable<any> {
    return this.http.get(this._BASE_URL + '/users');
  }

  postUserData(): Observable<UserDto> {
    return this.http.post<UserDto>(this._USER_DATA_URL, {email: this.currentUser.email});
  }

  getAdImages(adId: number): Observable<string[]> {
    return this.http.post<string[]>(this._GET_AD_IMAGES, adId);
  }

  postNewAdImages(data: FormData): Observable<void> {
    const headerPost = new HttpHeaders({'Content-Type': 'multipart/form-data'});
    return this.http.post<void>(this._NEW_AD_URL_IMAGES, data);
  }

  getAdsWithImages(): Observable<AddDto[]> {
    return this.http.post<AddDto[]>(this._GET_ADS_WITH_IMAGES, {});
  }
}