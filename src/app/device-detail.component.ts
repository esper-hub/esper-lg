import {Component, OnInit} from "@angular/core";
import {Device} from "./device";
import {ActivatedRoute, Params} from "@angular/router";
import {DeviceService} from "./device.service";

@Component({
  selector: 'device-detail',
  templateUrl: './device-detail.component.html',
})
export class DeviceDetailComponent implements OnInit {

  device: Device

  constructor(private readonly route: ActivatedRoute,
              private readonly deviceService: DeviceService) {
  }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: Params) => {
        this.device = this.deviceService.getDeviceById(params['id']);
      });
  }
}
