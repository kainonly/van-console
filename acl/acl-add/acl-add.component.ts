import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BitSwalService, BitService } from 'ngx-bit';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { asyncValidator } from 'ngx-bit/operates';
import { switchMap } from 'rxjs/operators';
import { AclService } from '../acl.service';
import * as packer from './language';

@Component({
  selector: 'van-acl-add',
  templateUrl: './acl-add.component.html'
})
export class AclAddComponent implements OnInit {
  form: FormGroup;
  writeLists: string[] = ['add', 'edit', 'delete'];
  readLists: string[] = ['get', 'originLists', 'lists'];

  constructor(
    public bit: BitService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private swal: BitSwalService,
    private aclService: AclService
  ) {
  }

  ngOnInit(): void {
    this.bit.registerLocales(packer);
    this.form = this.fb.group({
      name: this.fb.group(
        this.bit.i18nGroup({
          validate: {
            zh_cn: [Validators.required],
            en_us: [Validators.required]
          }
        })
      ),
      key: [null, [Validators.required], [this.existsKey]],
      write: [this.writeLists],
      read: [this.readLists],
      status: [true, [Validators.required]]
    });
  }

  existsKey = (control: AbstractControl) => {
    return asyncValidator(this.aclService.validedKey(control.value));
  };

  /**
   * 提交
   */
  submit(data): void {
    this.aclService.add(data).pipe(
      switchMap(res =>
        this.swal.addAlert(res, this.form, {
          status: true
        })
      )
    ).subscribe(() => {
    });
  }
}
