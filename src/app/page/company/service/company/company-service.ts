import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private baseUrl = 'http://localhost:8080/company';

  constructor(private http: HttpClient) { }

  getAllCompany() {
    return this.http.get(`${this.baseUrl}/get-all`);
  }
  addCompany(data: any) {
    return this.http.post(`${this.baseUrl}/add`, data);
  }

  deleteCompanyById(id: number) {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
  updateCompany(data: any) {
    return this.http.put(`${this.baseUrl}/update`, data);
  }
  editCompanyById(id: number) {
    return this.http.get(`${this.baseUrl}/search/${id}`);
  }
}
