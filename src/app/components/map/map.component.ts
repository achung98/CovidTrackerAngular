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
  private circles: any = {};
  private multipleCircles: any = {};
  private loading: boolean = false;

  constructor(private http: HttpClientService) { }

  ngOnInit() {
    this.http.getCountriesData().subscribe(res => {
      //this.countriesData = res;
      this.map = L.map('map', {
        center: [ 31.192628, -33.139288 ],
        worldCopyJump: true,
        zoom: 3,
        scrollWheelZoom: false
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

  public parseCountriesData(countries: any): any {
    for(let country in countries) {
      let tooltipData = `
        <strong>${countries[country].country}</strong><br>
        <hr>
        <strong>Cases:</strong> ${countries[country].cases}<br>
        <strong>Today:</strong> ${countries[country].today}<br>
        <strong>Recovered:</strong> ${countries[country].cured}<br>
        <strong>Deaths:</strong> ${countries[country].dead}
      `;

      this.circles[country] = L.circle([countries[country].lat, countries[country].lon], {radius: countries[country].cases})
      .bindTooltip(tooltipData, {
        sticky: true
      })
      .on('click', this.moreInfomation(country, countries[country].iso))
      .addTo(this.map);
    }
  }

  public moreInfomation(country: string, iso: string): any {
    return () => {
      if(this.findCachedProvinces(country)) {
        this.loading = true;
        document.getElementById('map-container').style.opacity = '0.8';
        this.http.getCountryData(iso).subscribe(res => {
          if(res[0].province && (res[0].lat && res[0].lon)) {
            this.circles[country].remove();
            let multipleCircles: any[] = [];
            for(let province of res) {
              if(province.lat != null && province.lon != null) {
                let perc = province.perc.toFixed(4);
                let tooltipData = `
                  <strong>${province.province}</strong><br>
                  <hr>
                  <strong>Cases:</strong> ${province.cases}<br>
                  <strong>Cured:</strong> ${province.cured}<br>
                  <strong>Deaths:</strong> ${province.dead}<br>
                  <strong>Fatality Rate:</strong> ${province.rate}<br>
                  <strong>Country Percentage:</strong> ${perc}%<br>
                `;

                multipleCircles.push(
                  L.circle([province.lat, province.lon], {radius: province.cases})
                  .bindTooltip(tooltipData, {
                    sticky: true
                  })
                  .on('click', this.returnToCountry(country))
                )
              }
            }
            this.multipleCircles[country] = L.layerGroup(multipleCircles)
            .addTo(this.map);
          }
          document.getElementById('map-container').style.opacity = '1';
          this.loading = false;
        });
      }
    }
  }

  private findCachedProvinces(country: string): boolean {
    if(this.multipleCircles[country]) {
      this.circles[country].remove();
      this.loading = true;
      document.getElementById('map-container').style.opacity = '0.8';

      setTimeout(() => {
        this.loading = false;
          document.getElementById('map-container').style.opacity = '1';
          this.multipleCircles[country]
          .addTo(this.map);
      }, 500);

      return false;
    }
    return true;
  }

  private returnToCountry(country: string): any {
    return () => {
      this.loading = true;
      document.getElementById('map-container').style.opacity = '0.8';
      this.map.removeLayer(this.multipleCircles[country]);
      setTimeout(() => {
        this.loading = false;
          document.getElementById('map-container').style.opacity = '1';
        this.circles[country].addTo(this.map);
      }, 500);
    }
  }
}
