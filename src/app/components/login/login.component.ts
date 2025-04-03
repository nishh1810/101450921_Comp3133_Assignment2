import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';  
import { Apollo } from 'apollo-angular';  
import { gql } from 'apollo-angular';     
import { CommonModule } from '@angular/common';  
import { AuthService } from '../../auth.service';  

@Component({
  selector: 'app-login',
  standalone: true,  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule]  
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private authService: AuthService, 
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],  
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return; 
    }

    const { username, password } = this.loginForm.value;  

    // Define the GraphQL login query
    const LOGIN_QUERY = gql`
      query Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          _id
          username
          email
          created_at
          updated_at
        }
      }
    `;

    // Send the login request to the GraphQL server
    this.apollo.query<{ login: { _id: string; username: string; email: string; created_at: string; updated_at: string } }>({
      query: LOGIN_QUERY,
      variables: { username, password },
    }).subscribe({
      next: (response) => {
        const userData = response.data?.login;
        if (userData) {
          console.log('Login successful:', userData);

          // Store user session in AuthService
          this.authService.setUser(userData);

          // Navigate to the employee page
          this.router.navigate(['/employee']);
        } else {
          alert('Login failed: Invalid response from server.');
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        alert('Login failed: ' + (error?.message || 'An error occurred during login.'));
      }
    });
  }
}
