import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import {ConfigService} from "./config.service";

export class Alias {
  name: string;
  link: URL;
}

@Injectable()
export class AliasService {

  private aliases: Promise<Map<string, Alias>>;

  constructor(private readonly http: Http,
              private readonly config: ConfigService) {
    this.aliases = this.http.get(config.aliases.url)
        .toPromise()
        .then(response => response.json() as Map<string, Alias>);
  }

  getAliasById(id: string): Promise<Alias> {
    return this.aliases.then(
      aliases => aliases[id]
    )
  }
}
