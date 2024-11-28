import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ZXingScannerComponent, ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat, Result } from '@zxing/library';
import { CommonModule } from '@angular/common';
import { qrResult } from '../../../models/qrResulr';
import { DataService } from '../../../services/cards-data.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [ ZXingScannerModule, CommonModule, RouterLink],
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.css'
})

export class ScanComponent  {
  qrResultString: string | null ='' 
  qrResultParsed:qrResult = {
    listId: '',
    guestId: '',
    status: ''
  }
  allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX]
  @ViewChild('scanner')
  scanner:  ZXingScannerComponent | undefined;
 scannerEnabled= true
  dataService = inject(DataService)
  clearResult(): void {
    this.qrResultString = null;
  }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    console.log(this.qrResultString)
     this.qrResultParsed = JSON.parse(this.qrResultString)
     console.log(this.qrResultParsed.listId,this.qrResultParsed.guestId)
     
this.dataService.getGuestById(this.qrResultParsed.listId,this.qrResultParsed.guestId).subscribe({
  next: (res) => {
    console.log(res)
    
  } ,
  error: (err) =>{
    console.error('Error catching guest:', err)
  }
})
    this.scannerEnabled = false
  }


  

  }

