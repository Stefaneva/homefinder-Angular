import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {UserService} from '../../user.service';
import {User} from '../../models/user';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  isLoginError = false;

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private spinnerService: Ng4LoadingSpinnerService) { }

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
            form.resetForm();
            console.log(this.userService.currentUser.email + ' ' + this.userService.currentUser.name);
            this.userService.closeDialog.emit(true);
          },
          (error: HttpErrorResponse) => {
            this.isLoginError = true;
          }
        );
      },
      (error1) => {
        this.spinnerService.hide();
        this.isLoginError = true;
      }
    );
  }
}
