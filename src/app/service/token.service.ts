import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  /**
  * Retrieves the JWT token from the browser's cookies.
  *
  * @returns The token as a string if found and valid, otherwise null.
  */
  public getToken(): string | null {
    const match = document.cookie.match(new RegExp('(^| )jwtToken=([^;]+)'));
    if (match) {
      try {
        const parsedCookie = JSON.parse(match[2]);
        return parsedCookie.token;
      } catch (error) {
        console.error('Error parsing jwtToken cookie:', error);
        return null;
      }
    }
    return null;
  }
}
