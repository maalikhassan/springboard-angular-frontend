import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private baseUrl = 'http://localhost:8080/room';

  constructor(private http: HttpClient) { }

  getAllRoom() {
    return this.http.get(`${this.baseUrl}/get-all`);
  }
  addRoom(data: any) {
    return this.http.post(`${this.baseUrl}/add`, data);
  }

  deleteRoomById(id: number) {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
  updateRoom(data: any) {
    return this.http.put(`${this.baseUrl}/update`, data);
  }
  editRoomById(id: number) {
    return this.http.get(`${this.baseUrl}/search/${id}`);
  }
}
