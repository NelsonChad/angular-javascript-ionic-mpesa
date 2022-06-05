import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EnvService } from '../services/env.service';

import { MpesaService } from '../services/mpesa.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  public response;
  public status;
  public amount;
  public cusnmr;

  public plat = 'WEB';
  constructor(private mpesa: MpesaService, private platform: Platform) {}

  doMpesa() {
    if (this.platform.is('android') || this.platform.is('cordova')) {
      this.plat = 'android';
      this.payMpesa();
    }
  }

  public payMpesa() {
    const timeInMs = Date.now();

    // eslint-disable-next-line prefer-const
    let resp = this.mpesa.initiate_c2b(
      Number(this.amount),
      Number('258' + this.cusnmr),
      'ref5',
      'T12344G' + timeInMs
    );
    from(resp)
      .pipe(
        tap((res) => {
          //CAN HANDLE RESPOSE ()
        })
      )
      .subscribe(
        (res) => {
          //HANDLE RESPOSE  ()
          //alert('SUBCR: ' + JSON.stringify(res));
          this.response = JSON.stringify(res.status);
          this.status = true;

          alert('SUBCR: ' + JSON.stringify(res.status));
          if (res.status == '201') {
            this.response = 'SUCESSO';
          }
          if (res.status == '500') {
            this.response = 'ERRO 1NTERNO';
          }
          if (res.status == '422') {
            this.response = 'SALDO INSUFICIENTE';
          }
          if (res.status == '400') {
            this.response = 'VERIFIQUE A INFORMACAO OU CONTACTE O M-PESA';
          }
          if (res.status == '401') {
            this.response = 'ERRO DE ENTRADA TENTE NOVAMENTE';
          }
        },
        (err) => {
          //HANDLE ERROR ()
          //alert('SUB ERROR: ' + JSON.stringify(err));
          this.response = JSON.stringify(err);
          if (err.status == '401') {
            this.response = 'ERRO DE ENTRADA TENTE NOVAMENTE';
          }
          this.status = false;
        }
      );
  }
}
