import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

import 'rxjs/add/operator/toPromise';


export type MqttProtocol = 'ws' | 'wss';

@Injectable()
export class ConfigService {

  private readonly url: string = 'config.json';

  aliases: {
    url: string
  };

  mqtt: {
    host: string;
    port: number;
    path: string;

    protocol: MqttProtocol;

    deviceTopic: string;
    updateTopic: string;
  };

  aliveAge: number;
  decayAge: number;

  constructor(private readonly http: Http) {
  }

  load(): Promise<void> {
    return this.http.get(this.url)
      .toPromise()
      .then(response => {
        Object.assign(this, response.json())
      });
  }
}
