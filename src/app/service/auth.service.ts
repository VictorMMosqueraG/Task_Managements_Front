import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserCreate } from '../models/User.Create.Dto';


/**
 * AuthService is responsible for handling authentication-related operations.
 * It interacts with the backend API to register users.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
  * The constructor injects the HttpClient for making HTTP requests.
  *
  * @param http HttpClient instance used to make API calls.
  */
  constructor(private http:HttpClient){}

  // The base URL for the authentication API.
  private api = 'http://localhost:5025/api/auth';

 /**
  * Registers a new user by sending the user data to the backend API.
  *
  * @param user The user information to be sent for registration. The user object must follow the IUserCreate interface structure.
  * @returns An Observable that will emit the API response.
  */
  post(user:IUserCreate):Observable<any>{
    // Set the HTTP headers for the request.
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

     // Make a POST request to the /register endpoint of the authentication API.
    return this.http.post(`${this.api}/register`,user,{headers})
  }
}
