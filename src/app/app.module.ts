import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {MqttModule, MqttService} from "angular2-mqtt";
import {MomentModule} from "angular2-moment";
import {ConfigService} from "./config.service";
import {AliasService} from "./alias.service";
import {DeviceService} from "./device.service";
import {AppComponent} from "./app.component";
import {ListComponent} from "./list.component";
import {DetailComponent} from "./detail.component";

export function mqttServiceFactory() {
  return new MqttService({
    connectOnCreate: true,
    hostname: "172.23.172.33",
    port: 80,
    path: "/lg/mqtt"
  });
}

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    DetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MqttModule.forRoot({
      provide: MqttService,
      useFactory: mqttServiceFactory
    }),
    MomentModule
  ],
  providers: [ConfigService, DeviceService, AliasService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
