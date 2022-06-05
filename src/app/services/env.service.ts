import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EnvService {
  constructor() {}

  MPESA_PUBLIC_KEY =
    'Your public key';
  MPESA_API_HOST = 'api.sandbox.vm.co.mz';
  MPESA_API_KEY = 'Your api key';
  MPESA_ORIGIN = 'developer.mpesa.vm.co.mz';
  MPESA_SERVICE_PROVIDER_CODE = 171717;
  BEARER = ''; //Authorization Bearer is a Base64 encoded string of the API Key after it was encrypted by the Public Key on the server.The Public Key is a 4096 bit RSA cipher that is encoded using Base64. at https://the-x.cn/en-US/cryptography/Rsa.aspx
}
