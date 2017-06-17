import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {DetailComponent} from "./detail.component";
import {MqttModule, MqttService} from "angular2-mqtt";
import {ConfigService} from "./config.service";
import {AliasService} from "./alias.service";
import {DeviceService} from "./device.service";

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
    DetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MqttModule.forRoot({
      provide: MqttService,
      useFactory: mqttServiceFactory
    })
  ],
  providers: [ConfigService, DeviceService, AliasService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
