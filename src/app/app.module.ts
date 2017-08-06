import {BrowserModule} from "@angular/platform-browser";
import {NgModule, APP_INITIALIZER} from "@angular/core";
import {HttpModule} from "@angular/http";
import {MqttModule, MqttService} from "angular2-mqtt";
import {MomentModule} from "angular2-moment";
import {ConfigService} from "./config.service";
import {AliasService} from "./alias.service";
import {DeviceService} from "./device.service";
import {AppComponent} from "./app.component";
import {ListComponent} from "./list.component";
import {DetailComponent} from "./detail.component";

export function mqttServiceFactory(config: ConfigService) {
  return new MqttService({
    connectOnCreate: true,
    hostname: config.mqtt.host,
    port: config.mqtt.port,
    path: config.mqtt.path,
    protocol: config.mqtt.protocol || 'ws',
  });
}

export function initConfigService(config: ConfigService) {
  return () => config.load();
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
      useFactory: mqttServiceFactory,
      deps: [ConfigService]
    }),
    MomentModule
  ],
  providers: [
    ConfigService,
    DeviceService,
    AliasService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfigService,
      deps: [ConfigService],
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
