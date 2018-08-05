import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {UserService} from '../../user.service';
import {User} from '../../models/user';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {SnotifyService} from 'ng-snotify';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  isLoginError = false;
  isLoginError2 = false;

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private spinnerService: Ng4LoadingSpinnerService,
              private snotifyService: SnotifyService) { }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    this.userService.userEvent = true;
    const username = form.value.username;
    const password = form.value.password;
    this.spinnerService.show();
    this.authService.login(username, password).subscribe(
      (data: any) => {
        this.userService.currentUser = new User;
        this.userService.currentUser.email = username;
        this.userService.currentUser.token = data.token;
        this.spinnerService.hide();
        this.userService.postUserData().subscribe(
          result => {
            this.userService.currentUser.name = result.name;
            this.userService.currentUser.phone = result.phone;
            this.userService.currentUser.lastLoginDate = result.lastLoginDate;
            this.userService.currentUser.type = result.userType;
            this.userService.currentUser.enabled = result.enabled;
            this.userService.currentUser.notification = result.notification;
            if (this.userService.currentUser.enabled) {
              form.resetForm();
              console.log(this.userService.currentUser.email + ' ' + this.userService.currentUser.name);
              this.userService.closeDialog.emit(true);
            } else {
              this.isLoginError2 = true;
              this.userService.currentUser = null;
            }
            console.log(this.userService.currentUser.notification);
            if (!this.userService.currentUser.notification) {
              this.userService.snotifyService.success('Body content', { position: 'rightTop'});
            } else if (this.userService.currentUser.notification === 1) {
              this.userService.snotifyService.info('O programare a fost acceptata', { position: 'rightTop'});
            } else if (this.userService.currentUser.notification === 2) {
              this.userService.snotifyService.error('O programare a fost anulata', { position: 'rightTop'});
            } else {
              this.userService.snotifyService.info('O programare este in asteptare', { position: 'rightTop'});
            }
          },
          (error: HttpErrorResponse) => {
            this.isLoginError = true;
          }
        );
      },
      (error1: HttpErrorResponse) => {
        this.spinnerService.hide();
        if (error1.name === 'Bad credentials!') {
          this.isLoginError = true;
        } else {
          this.isLoginError2 = true;
        }
      }
    );
  }
}
