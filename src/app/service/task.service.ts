import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http:HttpClient) { }

  private api = 'http://localhost:5025/api/tasks'

  getTasks(filters: any, token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let params = new HttpParams();

    if (filters.tittle) params = params.set('tittle', filters.tittle);
    if (filters.status && filters.status !== 'All') params = params.set('status', filters.status);
    if (filters.user) params = params.set('user', filters.user);
    if (filters.orderBy) params = params.set('orderBy', filters.orderBy);
    params = params.set('limit', filters.limit || '10');
    params = params.set('offset', filters.offset || '0');

    return this.http.get<any[]>(this.api, { headers, params });
  }
}
