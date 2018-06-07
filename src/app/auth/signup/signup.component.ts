import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SignupResponse} from './signup.response';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {UserService} from '../../user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  user_types: string[] = ['Cumparator/Chirias' , 'Agent Imobiliar'];
  password = '';

  constructor(private authService: AuthService,
              public userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'username' : new FormControl(null, Validators.required),
      'email' : new FormControl(null, [Validators.required, Validators.email]),
      'password' : new FormControl(null, Validators.required),
      'confirm_password' : new FormControl(null, [Validators.required, this.confirmPassword.bind(this)]),
      'phone' : new FormControl(null, [Validators.required, Validators.pattern('[0-9]{10}')]),
      'user_type' : new FormControl('Cumparator/Chirias')
    });
    // this.signupForm.setValidators(this.confirmPassword.bind(this));
  }

  onSubmit() {
    const data: SignupResponse = new SignupResponse;
    // console.log(this.signupForm);
    data.username = this.signupForm.value.username;
    data.password = this.signupForm.value.password;
    data.email = this.signupForm.value.email;
    data.phoneNumber = this.signupForm.value.phone;
    data.userType = this.signupForm.value.user_type;
    this.authService.register(data).subscribe(
      (response) => {
        console.log(response);
        this.signupForm.reset();
        this.userService.closeDialog.emit(true);
      },
          (error) => {
            console.log(error);
          }
    );
  }

  confirmPassword(control: FormGroup): {[s: string]: boolean} {
    if (control.value !== this.password) {
      return {'differentPasswords': false};
    }
    return null;
  }

  keyPress(event: any) {
    this.password = event.target.value;
  }
}
