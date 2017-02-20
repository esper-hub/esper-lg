import {Component} from "@angular/core";
import {DeviceService} from "./device.service";
import {Device} from "./device";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [DeviceService],
})
export class AppComponent {

  // selectedDevice: Device = null;

  readonly connected : Observable<boolean>;

  constructor(private readonly devices: DeviceService) {
    this.connected = devices.connected;
  }

  getTypes(): Set<string> {
    return this.devices.getTypes();
  }

  getDevicesByType(type: string): Set<string> {
    return this.devices.getDevicesByType(type);
  }

  getDevice(id: string): Device {
    return this.devices.getDeviceById(id);
  }

  triggerUpdate() {
    this.devices.triggerUpdates();
  }
}
