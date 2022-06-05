/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EnvService } from './env.service';

import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providendIn: 'root',
})

export class MpesaService {
  public amount = 0;
  public mpesaConfig;

  //constructor(private env: EnvService, private http: HttpClient) {}
  constructor(
    private env: EnvService,
    private httpNative: HTTP,
    private loadingController: LoadingController
  ) {}

  public initialize_api_from_dotenv() {
    if (!this.mpesaConfig) {
      this.mpesaConfig = {
        baseUrl: this.env.MPESA_API_HOST,
        apiKey: this.env.MPESA_API_KEY,
        publicKey: this.env.MPESA_PUBLIC_KEY,
        origin: this.env.MPESA_ORIGIN,
        serviceProviderCode: this.env.MPESA_SERVICE_PROVIDER_CODE,
      };
      this.validateConfig(this.mpesaConfig);
      console.log('Using M-Pesa environment configuration');
    } else {
      console.log('Using custom M-Pesa configuration');
    }
  }

  public required_config_arg(argName) {
    return (
      'Please provide a valid ' +
      argName +
      ' in the configuration when calling initializeApi()'
    );
  }

  validateConfig(configParams) {
    if (!configParams.baseUrl) {
      throw this.required_config_arg('baseUrl');
    }
    if (!configParams.apiKey) {
      throw this.required_config_arg('apiKey');
    }
    if (!configParams.publicKey) {
      throw this.required_config_arg('publicKey');
    }
    if (!configParams.origin) {
      throw this.required_config_arg('origin');
    }
    if (!configParams.serviceProviderCode) {
      throw this.required_config_arg('serviceProviderCode');
    }
  }

  public initializeApi(configParams) {
    this.validateConfig(configParams);
    this.mpesaConfig = configParams;
  }

  async initiate_c2b(amount, msisdn, transaction_ref, thirdparty_ref): Promise<any> {
    this.initialize_api_from_dotenv();
    this.initializeApi(this.mpesaConfig);

    const headers = {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer ' + this.env.BEARER,
      Origin: this.env.MPESA_ORIGIN,
    };

    try {
      let response;

      const data = {
        input_TransactionReference: transaction_ref,
        input_CustomerMSISDN: msisdn,
        input_Amount: amount,
        input_ThirdPartyReference: thirdparty_ref,
        input_ServiceProviderCode: this.mpesaConfig.serviceProviderCode,
      };

      console.log('JSON', data);

      const url =
        'https://' +
        this.mpesaConfig.baseUrl +
        ':18352/ipg/v1x/c2bPayment/singleStage/';

      console.log('URL', url);

      const loading = await this.loadingController.create();
      //await loading.present();
      this.httpNative.setDataSerializer('json');
      // eslint-disable-next-line prefer-const
      response = this.httpNative.post(url, data, headers);

      // SE QUER ALTERAR LOGO
      /*response = this.httpNative
      .post(url, data, headers)
      .then((res) => {
        //HANDLE RESPOSE ()
        alert('THAN DATA: ' + JSON.stringify(res));
        console.log(`Response Message: ${res}`);
      })
      .catch((error) => {
        console.log(`Response Err: ${error}`);
        //CAN HANDLE RESPOSE ERROR ()
        alert('CATCH DATA: ' + JSON.stringify(error));
      });*/

      return response;
    } catch (e) {
      if (e.response) {
        throw e.response;
      } else {
        throw e.message;
      }
    }
  }
}
