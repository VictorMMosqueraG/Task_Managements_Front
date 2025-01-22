import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  {

  loginForm: FormGroup;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  /**
  * Handles the form submission for login.
  */
  onSubmit(): void {
    // Check if the form is invalid and display an error message if so.
    if (this.loginForm.invalid) {
      this.message = "Invalid input";
      return;
    }

    // Extract the form data for login.
    const loginData = this.loginForm.value;

    // Call the AuthService to perform the login.
    this.authService.login(loginData).subscribe({
      next: (token) => {
        // Save the JWT token as a cookie with a max age of 24 hours.
        document.cookie = `jwtToken=${JSON.stringify(token)};path=/;Max-Age=86400`;
        alert("Login successfully");
        // console.log("login successfully");
        // console.log("cookie:",document.cookie);
        setTimeout(() => {
          this.router.navigate(['task-list']); // Replace '/another-component' with your target route.
        }, 1000);
      },
      error: (error) => {
        // Handle errors based on the HTTP status.
        if (error.status === 401) {
          this.message = "Invalid credentials.";
        } else {
          this.message = "Error during login.";
        }
      }
    });
  }
}
