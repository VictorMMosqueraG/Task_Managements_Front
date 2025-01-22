import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../service/task.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../service/token.service';

@Component({
  selector: 'app-task-delete',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './task-delete.component.html',
  styleUrl: './task-delete.component.css'
})
export class TaskDeleteComponent implements OnInit {
  deleteTaskForm: FormGroup;
  tasks: { id: number; tittle: string }[] = [];
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private tokenService:TokenService,
    private router: Router
  ) {
    this.deleteTaskForm = this.fb.group({
      taskId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  /**
   * Loads the list of tasks to display in the delete form.
   *
   * Retrieves tasks without filters or pagination from the API and populates the task list.
   * Displays an error message if the task loading fails.
   */
  private loadTasks(): void {
    this.taskService.loadTasks((tasks) => {
      this.tasks = tasks;
    });
  }

  /**
   * Handles the form submission for deleting a task.
   *
   * If the form is valid, it sends a request to the API to delete the task
   * based on the provided task ID. Displays a success message or an error message
   * based on the outcome of the request.
   */
  onSubmit(): void {
    if (this.deleteTaskForm.invalid) {
      this.message = 'Invalid input';
      return;
    }

    const taskId = this.deleteTaskForm.value.taskId;
    const token = this.tokenService.getToken();

    if (!token) {
      this.message = 'No valid token found';
      return;
    }

    this.taskService.deleteTask(taskId, token).subscribe({
      next: () => {
        this.message = 'Task deleted successfully!';
        setTimeout(() => this.router.navigate(['/task-list']), 1000);
      },
      error: (error) => {
        this.message =
          error.status === 401
            ? 'Unauthorized - Invalid token'
            : 'Error deleting the task.';
        console.error('Error deleting task:', error);
      }
    });
  }
}
