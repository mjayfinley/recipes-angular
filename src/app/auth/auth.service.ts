import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private http: HttpClient) {}

    signup(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC0Kir18tBbYMmnZ_bnIYcG8op-3zrbGtQ',
                { email: email, password: password, returnSecureToken: true },
            )
            .pipe(catchError(this.handleError));
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC0Kir18tBbYMmnZ_bnIYcG8op-3zrbGtQ',
                { email: email, password: password, returnSecureToken: true },
            )
            .pipe(catchError(this.handleError));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This Email already exists.';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This Email does not exist.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'Password is incorrect.';
                break;
        }

        return throwError(errorMessage);
    }
}
