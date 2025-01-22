import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ITaskCreate } from '../models/task/Task.Create.Dto';
import { IUpdateTaskDto } from '../models/task/Task.Update.Dto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http:HttpClient,
    private tokenService:TokenService
  ) { }

  private api = 'http://localhost:5025/api/tasks'

  /**
  * Fetches tasks from the API with filters and pagination.
  *
  * @param filters Object containing filter criteria like title, status, user, etc.
  * @param token JWT token for authorization.
  * @returns Observable emitting the list of tasks matching the filters.
  */
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


  /**
  * Creates a new task by sending task data to the API.
  *
  * @param taskData The data of the task to be created.
  * @param token JWT token for authorization.
  * @returns Observable emitting the response from the API.
  */
  createTask(taskData: ITaskCreate, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.api, taskData, { headers });
  }

  /**
  * Deletes a task from the API by its ID.
  *
  * @param taskId The ID of the task to be deleted.
  * @param token JWT token for authorization.
  * @returns Observable emitting the response from the API.
  */
  deleteTask(taskId: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.api}/${taskId}`;
    return this.http.delete(url, { headers });
  }

  /**
  * Updates a task by its ID with the provided data.
  *
  * @param id The ID of the task to be updated.
  * @param taskData The data to update the task with.
  * @param token JWT token for authorization.
  * @returns Observable emitting the response from the API.
  */
  updateTask(id: number, taskData: IUpdateTaskDto, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.api}/${id}`, taskData, { headers });
  }

  /**
  * Fetches a list of users from the API.
  *
  * @param token JWT token for authorization.
  * @returns Observable emitting a list of users with id and name properties.
  */
  getUsers(token: string): Observable<{ id: number; name: string }[]> {
    return this.http
      .get<{ status: number; data: { id: number; name: string }[] }>(
        'http://localhost:5025/api/user/findUser')
      .pipe(
        map((response) => response.data) // Extract only the "data" property from the response
      );
  }

  /**
  * Fetches a list of tasks without any filters or pagination.
  *
  * @returns Observable emitting a list of tasks with id and title properties.
  */
  getTasksDefault(): Observable<{ id: number; tittle: string }[]> {
    return this.http
      .get<{ id: number; tittle: string }[]>('http://localhost:5025/api/tasks/findTask');
  }

  /**
  * Fetches a list of users from the API.
  *
  * @param token JWT token for authorization.
  * @returns Observable emitting a list of users with id and name properties.
  */
  getTaskById(taskId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:5025/api/tasks/findTaskById/${taskId}`);
  }


  loadTasks(callback: (tasks: any[]) => void): void {
    const token = this.tokenService.getToken();
    if (!token) {
      throw new Error('No valid token found');
    }

    this.getTasksDefault().subscribe({
      next: callback,
      error: (error) => {
        console.error('Error loading tasks:', error);
        throw new Error('Failed to load tasks.');
      }
    });
  }
}
