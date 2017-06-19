import {Component} from "@angular/core";
import {Observable} from "rxjs";

import {DeviceService, Device} from "./device.service";

import * as _ from "lodash";


@Component({
  selector: 'app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly connected: Observable<boolean>;

  constructor(private readonly devices: DeviceService) {
    this.connected = devices.connected;
  }

  triggerUpdate(): Promise<void> {
    return this.devices.triggerUpdates();
  }
}
