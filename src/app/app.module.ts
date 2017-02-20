import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {AppComponent} from "./app.component";
import {DeviceDetailComponent} from "./device-detail.component";
import {MqttModule, MqttService} from "angular2-mqtt";

export function mqttServiceFactory() {
  return new MqttService({
    hostname: "172.23.172.33",
    port: 80,
    path: "/lg/mqtt"
  });
}

@NgModule({
  declarations: [
    AppComponent,
    DeviceDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: ':id',
        component: DeviceDetailComponent
      }
    ]),
    MqttModule.forRoot({
      provide: MqttService,
      useFactory: mqttServiceFactory
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
