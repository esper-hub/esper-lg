import {Injectable} from "@angular/core";
import {Device} from "./device";
import {MqttService, MqttConnectionState} from "angular2-mqtt";
import {Observable} from "rxjs";
import "rxjs/add/operator/map";
import {TextDecoder} from "text-encoding";

@Injectable()
export class DeviceService {

  private static readonly TOPIC = "maglab/space/esper";

  private static readonly DECODER: TextDecoder = new TextDecoder("utf-8");

  public readonly connected: Observable<boolean>;

  private devices: {[id: string]: Device} = {};

  constructor(private readonly mqtt: MqttService) {
    this.connected = this.mqtt.state.map((s) => s == MqttConnectionState.CONNECTED);

    this.mqtt.observe(`${DeviceService.TOPIC}/+/info`).subscribe((msg) => {
      console.log(msg);

      let device = new Device();

      // Get 2nd-last path element as ID
      device.id = msg.topic.split("/").reverse()[1];

      // Parse the message
      for (let line of DeviceService.DECODER.decode(msg.payload).split("\n")) {
        let [key, value] = line.split("=", 2);

        switch (key) {
          case "DEVICE":
            device.type = value;
            break;

          case "ESPER":
            device.firmwareVersion = value;
            break;

          case "SDK":
            device.sdkVersion = value;
            break;

          case "BOOT":
            device.bootVersion = value;
            break;

          case "CHIP":
            device.chipId = value;
            break;

          case "FLASH":
            device.flashId = value;
            break;

          case "ROM":
            device.rom = +value == 1;
            break;
        }
      }

      this.devices[device.id] = device;
    })
  }

  getTypes(): Set<string> {
    return new Set(Object.keys(this.devices).map((key) => this.devices[key].type));
  }

  getDevicesByType(type: string): Set<string> {
    return new Set(Object.keys(this.devices).filter((key) => this.devices[key].type == type));
  }

  getDeviceById(id: string): Device {
    return this.devices[id];
  }

  triggerUpdates() {
    this.mqtt.publish(`${DeviceService.TOPIC}/update`, '').subscribe();
  }
}
