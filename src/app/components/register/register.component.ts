import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { IUserCreate } from '../../models/User.Create.Dto';

/**
* RegisterComponent is a form-based component that handles user registration.
* It validates the input fields and sends the user data to the backend API for registration.
*/
@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // Import necessary Angular modules for forms and common utilities.
  providers: [AuthService], // Register AuthService as a provider for dependency injection.
  templateUrl: './register.component.html', // Path to the component's template.
  styleUrls: ['./register.component.css'], // Path to the component's styles.
})
export class RegisterComponent {

  // FormGroup instance to handle form validation and submission.
  userForm: FormGroup;

  // Variables to manage the snackbar visibility and message.
  snackBarMessage: string = '';
  snackBarVisible: boolean = false;

  /**
  * Constructor for RegisterComponent.
  * Injects the necessary services for authentication, form building, and routing.
  *
  * @param authService The service responsible for authentication API calls.
  * @param fb The FormBuilder service to create the form.
  * @param router The Router service to navigate after successful registration.
  */
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialize the form group with form controls and validators.
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [0, [Validators.required, Validators.min(1)]]
    });
  }

  /**
  * Handles form submission.
  * Validates the form and sends the user data to the API for registration.
  */
  onSubmit() {
    // If the form is invalid, return without submitting.
    if (this.userForm.invalid) return;

    // Extract user data from the form and prepare it for the API call.
    const userData: IUserCreate = { ...this.userForm.value };

    // Call AuthService to register the user.
    this.authService.register(userData).subscribe({
      next: () => {
        // If the registration is successful, show a success message.
        alert("User was created")
        this.showSnackBar('User registered successfully!');

         // Navigate to another component after a brief delay.
         setTimeout(() => {
          this.router.navigate(['/']); // Replace '/another-component' with your target route.
        }, 3000);
      },
      error: (err) => {
        // If there's an error, log it and show an error message.
        console.error(err);
        this.showSnackBar('Error registering user');
      },
    });
  }

  /**
  * Displays a snackbar message for feedback.
  *
  * @param message The message to be displayed in the snackbar.
  */
  private showSnackBar(message: string) {
    this.snackBarMessage = message;
    this.snackBarVisible = true;

    // Hide the snackbar after 3 seconds.
    setTimeout(() => {
      this.snackBarVisible = false;
    }, 3000);
  }
}
