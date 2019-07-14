import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ThermoNode } from 'src/app/data-model/thermo-node';

@Injectable({
  providedIn: 'root'
})
export class RetrieveDataService {
  SERVER_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getData(fromDate: number, toDate: number): Observable<ThermoNode[]> {
    return this.http.get<ThermoNode[]>(
      this.SERVER_URL + '/api/thermoData/' + fromDate + '/' + toDate
    );
  }
}
