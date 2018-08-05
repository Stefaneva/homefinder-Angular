import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';

@Component({
  selector: 'app-modal-agreement',
  templateUrl: './modal-agreement.component.html',
  styleUrls: ['./modal-agreement.component.css']
})
export class ModalAgreementComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  confirmDelete() {
    this.userService.closeDialog.emit(true);
    if (this.userService.adDeletedOwner) {
      const index = this.userService.myAds.indexOf(this.userService.adDeletedOwner);
      this.userService.myAds.splice(index, 1);
      this.userService.deleteAd(this.userService.adDeletedOwner.id).subscribe(
        result => {
          console.log(result);
        }
      );
    } else {
      const index = this.userService.ads.indexOf(this.userService.adDeletedAdmin);
      this.userService.ads.splice(index, 1);
      this.userService.deleteAd(this.userService.adDeletedAdmin.id).subscribe(
        result => {
          console.log(result);
        }
      );
    }
  }

  closeModal() {
    this.userService.closeDialog.emit(true);
  }
}
