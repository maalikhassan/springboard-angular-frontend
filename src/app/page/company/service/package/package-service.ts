import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  private baseUrl = 'http://localhost:8080/package';

  constructor(private http: HttpClient) { }

  getAllPackage() {
    return this.http.get(`${this.baseUrl}/get-all`);
  }
  addPackage(data: any) {
    return this.http.post(`${this.baseUrl}/add`, data);
  }

  deletePackageById(id: number) {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
  updatePackage(data: any) {
    return this.http.put(`${this.baseUrl}/update`, data);
  }
  editPackageById(id: number) {
    return this.http.get(`${this.baseUrl}/search/${id}`);
  }
}
