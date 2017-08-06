import {Injectable} from "@angular/core";
import {MqttService, MqttConnectionState} from "angular2-mqtt";

import {Observable} from "rxjs";
import {ConfigService} from "./config.service";
import {Alias, AliasService} from "./alias.service";

import {TextDecoder} from "text-encoding";

import * as _ from "lodash";


export class Device {
  id: string;
  type: string;

  firmwareVersion: string;
  sdkVersion: string;
  bootVersion: string;

  chipId: string;
  flashId: string;

  rom: boolean;

  timeStartup: number;
  timeConnect: number;
  timeUpdated: number;

  age: number;
  alive: boolean;

  alias: Alias;
}

@Injectable()
export class DeviceService {

  public readonly connected: Observable<boolean>;

  private readonly devices: Map<string, Device>;

  constructor(private readonly mqtt: MqttService,
              private readonly config: ConfigService,
              private readonly aliases: AliasService) {
    this.connected = this.mqtt.state.map((s) => s == MqttConnectionState.CONNECTED);

    this.devices = new Map();

    this.mqtt.observe(`${this.config.mqtt.deviceTopic}/+/info`)
        .subscribe(msg => {
          let device = new Device();

          // Get 2nd-last path element as ID
          // TODO: Use regex to verify format and extract ID
          device.id = msg.topic.split("/").reverse()[1];

          // Fetch alias data
          this.aliases.getAliasById(device.id).then(alias => {
            device.alias = alias;
          });

          // Parse the message
          for (let line of new TextDecoder("ASCII").decode(msg.payload).split("\n")) {
            let [key, value] = line.split("=", 2);

            switch (key) {
              case "DEVICE":       device.type = value; break;
              case "ESPER":        device.firmwareVersion = value; break;
              case "SDK":          device.sdkVersion = value; break;
              case "BOOT":         device.bootVersion = value; break;
              case "CHIP":         device.chipId = value; break;
              case "FLASH":        device.flashId = value; break;
              case "ROM":          device.rom = +value == 1; break;
              case "TIME_STARTUP": device.timeStartup = +value * 1000; break;
              case "TIME_CONNECT": device.timeConnect = +value * 1000; break;
              case "TIME_UPDATED": device.timeUpdated = +value * 1000; break;
            }
          }

          device.age = _.now() - device.timeUpdated;
          device.alive = device.age < this.config.aliveAge;

          if (device.age < this.config.decayAge) {
            this.devices.set(device.id, device);
          } else {
            this.devices.delete(device.id);
          }
        });
  }

  getDevices(): Array<Device> {
    return Array.from(this.devices.values());
  }

  getDeviceById(id: string): Device {
    return this.devices.get(id);
  }

  triggerUpdates(): Promise<void> {
    return this.mqtt.publish(this.config.mqtt.updateTopic, '').toPromise();
  }
}
