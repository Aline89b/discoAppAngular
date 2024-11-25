import { Component, ViewChild } from '@angular/core';
import { ZXingScannerComponent, ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat, Result } from '@zxing/library';
@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [ ZXingScannerModule],
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.css'
})
export class ScanComponent {
  allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX]
  @ViewChild('scanner')
  scanner: ZXingScannerComponent | undefined;

  hasDevices: boolean | undefined;
  hasPermission: boolean | undefined;
  qrResultString: string | undefined;
  qrResult: Result | undefined;

  availableDevices: MediaDeviceInfo[] | undefined;
  currentDevice: MediaDeviceInfo | undefined;

  ngOnInit(): void {

 
  //  this.scanner!.camerasNotFound.subscribe(() => this.hasDevices = false);
    this.scanner!.scanComplete.subscribe((result: Result) => this.qrResult = result);
    this.scanner!.permissionResponse.subscribe((perm: boolean) => this.hasPermission = perm);
  }

  displayCameras(cameras: MediaDeviceInfo[]) {
    console.debug('Devices: ', cameras);
    this.availableDevices = cameras;
  }

  handleQrCodeResult(resultString: string) {
    console.debug('Result: ', resultString);
    this.qrResultString = resultString;
  }

 


}
