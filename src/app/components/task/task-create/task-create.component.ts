import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../../service/task.service';
import { ITaskCreate } from '../../../models/task/Task.Create.Dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-create',
  imports:[CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css'],
})
export class TaskCreateComponent implements OnInit {
  taskForm: FormGroup;
  message: string | null = null;
  users: { id: number; name: string }[] = []; // List for user

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      tittle: ['', [Validators.required]],
      description: [''],
      status: ['', [Validators.required]],
      user: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  /**
  * Handles the form submission to create a new task.
  * Validates the input, sends the data to the API, and navigates to the task list upon success.
  */
  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.message = 'Invalid input';
      return;
    }

    const taskData: ITaskCreate = this.taskForm.value;
    const token = this.getToken();

    if (!token) {
      this.message = 'No valid token found';
      return;
    }

    this.taskService.createTask(taskData, token).subscribe({
      next: () => {
        this.message = 'Task created successfully!';
        alert("Tas create successfully")
        setTimeout(() => {
          this.router.navigate(['/task-list']);
        }, 1000);
      },
      error: (error) => {
        this.message = error.status === 401
          ? 'Unauthorized - Invalid token'
          : 'Error during task creation.';
      },
    });
  }


  /**
  * Loads the list of users from the API to populate the user dropdown.
  */
  private loadUsers(): void {
    const token = this.getToken();
    if (!token) {
      this.message = 'No valid token found';
      return;
    }

    this.taskService.getUsers(token).subscribe({
      next: (users) => {
        this.users = users; // assign user from backend
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.message = 'Failed to load users.';
      },
    });
  }

  /**
  * Retrieves the JWT token from the browser's cookies.
  *
  * @returns The token as a string if found and valid, otherwise null.
  */
  private getToken(): string | null {
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
