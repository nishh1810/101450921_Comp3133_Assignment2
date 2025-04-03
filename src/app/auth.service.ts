import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user = new BehaviorSubject<any>(null);  // Store user data
  user$ = this._user.asObservable();  // Observable to track user state

  constructor() {
    // Load user session from localStorage when the app starts
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this._user.next(JSON.parse(savedUser));
    }
  }

  // Store user data in the service and persist in localStorage
  setUser(user: any) {
    this._user.next(user);
    localStorage.setItem('user', JSON.stringify(user));  // Persist user data
  }

  // Clear user session
  logout() {
    this._user.next(null);
    localStorage.removeItem('user');  // Remove user data from localStorage
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this._user.value;  // Return true if user data exists
  }

  // Get the stored user data (e.g., for display purposes)
  getUser() {
    return this._user.value;  // Return current user data
  }
}
