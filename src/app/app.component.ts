import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Employee Management App';
  isLoggedIn: boolean = false; // Track login state

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Subscribe to the user session observable and update the login state
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user; // True if a user exists, false if null
      if (this.isLoggedIn) {
        this.router.navigate(['/employee']); // Redirect to the employee page if logged in
      } else if (this.router.url !== '/login') {
        this.router.navigate(['/login']); // Redirect to login page if not logged in
      }
    });

    // Check for an active session when the app loads, to prevent redirection to login
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/employee']);
    }
  }

  logout() {
    this.authService.logout(); // Call logout method from AuthService
    this.router.navigate(['/login']); // Redirect to login page after logging out
  }
}
