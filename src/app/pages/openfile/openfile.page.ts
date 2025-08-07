import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-openfile',
  templateUrl: './openfile.page.html',
  styleUrls: ['./openfile.page.scss'],standalone: false
})
export class OpenfilePage implements OnInit {
  @Input() imageUrl: any='';

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
