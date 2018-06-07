import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {MatDialog} from '@angular/material';
import {SigninComponent} from '../auth/signin/signin.component';
import {SignupComponent} from '../auth/signup/signup.component';
import {AddComponent} from '../add/add.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public userService: UserService,
              private dialog: MatDialog) { }

  ngOnInit() {
  }

  openLogin(): void {
    this.userService.closeDialog.subscribe(result => this.dialog.closeAll());
    const dialogRef = this.dialog.open(SigninComponent, {});
  }

  openRegister(): void {
    this.userService.closeDialog.subscribe(result => this.dialog.closeAll());
    const dialogRef = this.dialog.open(SignupComponent, {});
  }

  logout() {
    this.userService.currentUser.name = null;
    this.userService.currentUser.email = null;
    this.userService.currentUser.token = null;
    this.userService.currentUser.lastLoginDate = null;
    this.userService.currentUser.blocked = null;
    this.userService.currentUser.phone = null;
    this.userService.currentUser.type = null;
  }

  addNewAd(): void {
    this.userService.closeDialog.subscribe(result => this.dialog.closeAll());
    const dialogRef = this.dialog.open(AddComponent, {});
  }
}
