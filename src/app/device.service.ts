import {Injectable} from "@angular/core";
import {MqttService, MqttConnectionState} from "angular2-mqtt";

import {Observable} from "rxjs";
import {ConfigService} from "./config.service";
import {Alias, AliasService} from "./alias.service";

import * as _ from "lodash";


class DeviceInfo {
  device: string;

  chip_id: string;
  flash_id: string;

  version: {
    esper: string;
    sdk: string;
    boot: number;
  };

  boot: {
    rom: number;
  };

  time: {
    startup: number,
    connect: 1502080968,
    updated: 1502080968
  };

  network: {
    ip: string;
    mask: string;
    gateway: string;
  };

  wifi: {
    ssid: string;
    bssid: string;
    rssi: number;
    channel: number;
  };
}


export class Device {
  id: string;
  type: string;

  chipId: string;
  flashId: string;

  version: {
    firmware: string;
    sdk: string;
    boot: number;
  };

  boot: {
    rom: boolean;
  };

  time: {
    startup: number;
    connect: number;
    updated: number;
  };

  network: {
    ip: string;
    mask: string;
    gateway: string;
  };

  wifi: {
    ssid: string;
    bssid: string;
    rssi: number;
    channel: number;
  };

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
          try {
            let info = JSON.parse(msg.payload.toString()) as DeviceInfo;

            device.type = info.device;

            device.chipId = info.chip_id;
            device.flashId = info.flash_id;

            device.version = {
              firmware: info.version.esper,
              sdk: info.version.sdk,
              boot: info.version.boot
            };

            device.boot = {
              rom: info.boot.rom == 1,
            };

            device.time = {
              startup: info.time.startup * 1000,
              connect: info.time.connect * 1000,
              updated: info.time.updated * 1000,
            };

            device.network = {
              ip: info.network.ip,
              mask: info.network.mask,
              gateway: info.network.gateway,
            };

            device.wifi = {
              ssid: info.wifi.ssid,
              bssid: info.wifi.bssid,
              rssi: info.wifi.rssi,
              channel: info.wifi.channel,
            };

            device.age = _.now() - device.time.updated;
            device.alive = device.age < this.config.aliveAge;

            if (device.age < this.config.decayAge) {
              this.devices.set(device.id, device);
            } else {
              this.devices.delete(device.id);
            }

          } catch(e) {
            console.warn(e);
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
