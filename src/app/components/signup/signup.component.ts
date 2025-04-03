import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';  // Apollo service for GraphQL requests
import { gql } from 'apollo-angular';  // gql tag for queries and mutations
import { CommonModule } from '@angular/common';  // Import CommonModule for directives like NgIf
import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule

@Component({
  selector: 'app-signup',
  standalone: true, 
  imports: [ReactiveFormsModule, CommonModule], // Add CommonModule here
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apollo: Apollo  // Inject Apollo service
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {}

  // Password match validation
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Define GraphQL mutation
  private SIGNUP_MUTATION = gql`
    mutation Signup($username: String!, $email: String!, $password: String!) {
      signup(username: $username, email: $email, password: $password) {
        username
        email
        created_at
        updated_at
      }
    }
  `;

  // Submit form and send GraphQL request
  onSubmit() {
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;

      // Call the GraphQL mutation with the data from the form
      this.apollo.mutate({
        mutation: this.SIGNUP_MUTATION,
        variables: {
          username: name,
          email: email,
          password: password
        }
      }).subscribe({
        next: (response) => {
          console.log('Signup successful:', response);
          // Navigate to login page upon success
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Signup failed:', error);
          // Display error message or alert to the user
          alert('Signup failed, please try again. ' + (error?.message || 'An error occurred during login.'));
        }
      });
    }
  }

  // Access form controls
  get f() {
    return this.signupForm.controls;
  }
}
