import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-qrcode',
  standalone: true,
  imports: [],
  templateUrl: './qrcode.component.html',
  styleUrl: './qrcode.component.css'
})
export class QrcodeComponent implements OnInit{
  qrCodeUrl: string = '';
  listId: string = '';
  guestId: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.listId = this.route.snapshot.paramMap.get('listId')!;
    this.guestId = this.route.snapshot.paramMap.get('guestId')!;
    
    this.qrCodeUrl = `http://localhost:3000/api/qrcodes/${this.listId}/${this.guestId}.png`;
  }
}
