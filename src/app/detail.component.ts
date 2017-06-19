import {Component, Input} from "@angular/core";
import {Device} from "./device.service";

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
})
export class DetailComponent {

  @Input()
  device: Device;

  constructor() {
  }
}
