import {Component} from "@angular/core";
import {Observable} from "rxjs";

import {DeviceService, Device} from "./device.service";

import * as _ from "lodash";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly connected: Observable<boolean>;

  selectedDevice: Device;

  constructor(private readonly devices: DeviceService) {
    this.connected = devices.connected;
  }

  getDevices() {
    return _.toPairs(_.groupBy(this.devices.getDevices(), (device) => device.type));
  }

  selectDevice(device: Device) {
    this.selectedDevice = device;
  }

  triggerUpdate(): Promise<void> {
    return this.devices.triggerUpdates();
  }
}
