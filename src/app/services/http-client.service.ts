import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private readonly entry: string = 'https://sleepy-coast-59266.herokuapp.com';

  constructor(private http: HttpClient) { }

  test() {
    console.log("test");
  }

  public getGlobalData(): Observable<any> {
    return this.http.get(`${this.entry}/api/global`);
  }

  public getCountriesData(): Observable<any> {
    return this.http.get(`${this.entry}/api/countries`);
  }

  public getCountryData(country: string): Observable<any> {
    return this.http.get(`${this.entry}/api/country/${country}`);
  }
}
