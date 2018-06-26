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
    const index = this.userService.myAds.indexOf(this.userService.adDeleted);
    this.userService.myAds.splice(index, 1);
    this.userService.deleteAd(this.userService.adDeleted.id).subscribe(
      result => {
        console.log(result);
      }
    );
  }

  closeModal() {
    this.userService.closeDialog.emit(true);
  }
}
