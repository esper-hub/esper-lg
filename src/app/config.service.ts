import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

import 'rxjs/add/operator/toPromise';


export class Config {
  aliases: {
    url: string
  };

  mqtt: {
    host: string;
    port: number;
    path: string;

    deviceTopic: string;
    updateTopic: string;
  };

  aliveAge: number;
  decayAge: number;
}

@Injectable()
export class ConfigService {

  private url: string = 'config.json';

  private config: Promise<Config>;

  constructor(private readonly http: Http) {
    this.config = this.http.get(this.url)
      .toPromise()
      .then(response => response.json() as Config);
  }

  getConfig(): Promise<Config> {
    return this.config;
  }
}
