import {Component, Output, EventEmitter} from "@angular/core";
import {DeviceService, Device} from "./device.service";
import * as _ from "lodash";


@Component({
  selector: 'list',
  templateUrl: './list.component.html',
})
export class ListComponent {

  selection: Device;

  constructor(private readonly devices: DeviceService) {
  }

  getDevices() {
    return _.toPairs(_.groupBy(this.devices.getDevices(), (device) => device.type));
  }
}
