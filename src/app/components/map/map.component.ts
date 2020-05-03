import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';

// Services
import { HttpClientService } from '../../services/http-client.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  private map: any;
  private countriesData: any; // To change to coutnries data interface

  constructor(private http: HttpClientService) { }

  ngOnInit() {
    this.http.getCountriesData().subscribe(res => {
      //this.countriesData = res;
      this.map = L.map('map', {
        center: [ 31.192628, -33.139288 ],
        zoom: 3
      });

      // Getting tiles to render the map
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });

      tiles.addTo(this.map);

      this.parseCountriesData(res);
    })
  }

  private parseCountriesData(countries: any): any {
    console.log(countries);
    for(let country in countries) {
      let tooltipData = `
        ${country}<br>
        Cases: ${countries[country].cases}<br>
        Today: ${countries[country].today}<br>
        Recovered: ${countries[country].cured}<br>
        Deaths: ${countries[country].dead}
      `;
      L.circle([countries[country].lat, countries[country].lon], {radius: countries[country].cases})
      .bindTooltip(tooltipData, {
        sticky: true
      })
      .addTo(this.map);
    }
  }
}
