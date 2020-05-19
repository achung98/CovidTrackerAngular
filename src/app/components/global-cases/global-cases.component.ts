// Angular Modules
import { Component, OnInit } from '@angular/core';

// Interfaces
import { Cases, Current } from '../../interfaces/global-cases';

// Services
import { HttpClientService } from '../../services/http-client.service';

@Component({
  selector: 'app-global-cases',
  templateUrl: './global-cases.component.html',
  styleUrls: ['./global-cases.component.scss']
})
export class GlobalCasesComponent implements OnInit {
  private current: Current;
  private recovered: Cases;
  private deaths: Cases;

  constructor(private httpClient: HttpClientService) { }

  ngOnInit() {
    this.httpClient.getGlobalData().subscribe(res => {
      this.current = {
        num: res.confirmed,
        latest_update: res.last_update.split(" ").join(" at ")
      };

      this.recovered = {
        num: res.recovered,
        diff: res.recovered_diff,
        rate: Number((( res.recovered / res.confirmed ) * 100).toFixed(4))
      };

      this.deaths = {
        num: res.deaths,
        diff: res.deaths_diff,
        rate: Number((res.fatality_rate * 100).toFixed(4))
      }
    })
  }

}
