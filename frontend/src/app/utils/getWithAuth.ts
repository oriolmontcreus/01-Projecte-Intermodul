import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";

/**
 * This function makes an authenticated HTTP GET request.
 *
 * @param {HttpClient} http - The HttpClient instance used to make the HTTP request.
 * @param {string} url - The URL to which the HTTP request is sent.
 * @returns {Observable<any>} - An Observable that contains the response of the HTTP request.
 * If the token is not found in local storage, it returns an Observable of null.
 */
export function getWithAuth(http: HttpClient, url: string): Observable<any> {
    let token;
    
    if (typeof window !== 'undefined')
        token = window.localStorage.getItem('token');

    if (!token) return of(null);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers };

    return http.get(url, options);
}