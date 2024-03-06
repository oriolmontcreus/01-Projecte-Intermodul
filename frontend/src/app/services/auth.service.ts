import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { URI } from '../../environment'
import { tap } from 'rxjs/operators';
import UserPayload from '@dto/types/User/UserPayload';
import ApiResponse from '@dto/types/General/ApiResponse';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, private router: Router) { }

    login(userPayload: UserPayload, remember: boolean): Observable<any> {
      return this.http.post<ApiResponse>(`${URI}/auth/login`, { ...userPayload, remember }).pipe(
        tap({
          next: (response) => {
            if (response.status === 'SUCCESS') {
              localStorage.setItem('user', JSON.stringify(response.payload.user));
              if (remember) {
                localStorage.setItem('token', response.payload.token);
              }
              console.log('SUCCESS', response.payload.token)
            }
          },
          error: (error) => {
            console.error('Error:', error);
          },
          complete: () => {}
        })
      );
    }

    /**
     * Decorator to require authentication for a method
     */
    RequiresAuth(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
    
      descriptor.value = function (...args: any[]) {
        const token = localStorage.getItem('token');
    
        if (!token) {
          console.error('User is not authenticated');
          return;
        }
    
        return originalMethod.apply(this, args);
      };
    
      return descriptor;
    }

    autoLogin(): Observable<any> {
      if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem('token');
        if (!token) return of(null);

        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.post<ApiResponse>(`${URI}/auth/validate-token`, {}, { headers }).pipe(
          tap({
            next: (response) => {
              if (response.status === 'SUCCESS'){
                this.router.navigate(['/survey']);
                return;
              }
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            },
            error: (error) => {
              console.error('Error:', error);
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            },
            complete: () => {}
          })
        );
      } else {
        return of(null);
      }
    }
}