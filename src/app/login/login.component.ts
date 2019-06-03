import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzNotificationService} from 'ng-zorro-antd';
import {BitService} from 'ngx-bit';
import {MainService} from '../api/main.service';
import packer from './language';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private mainService: MainService,
              private notification: NzNotificationService,
              private router: Router,
              private fb: FormBuilder,
              public bit: BitService) {
  }

  ngOnInit() {
    this.bit.registerLocales(packer);
    this.form = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(18)]]
    });
  }

  submit(data: any) {
    this.mainService.login(data.username, data.password).subscribe(res => {
      if (!res.error) {
        localStorage.setItem('username', data.username);
        this.notification.success(this.bit.l.login_tips, this.bit.l.login_success);
        this.router.navigateByUrl('/');
      } else {
        this.notification.error(this.bit.l.login_tips, this.bit.l.login_failed);
      }
    });
  }
}