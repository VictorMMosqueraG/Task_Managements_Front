import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../service/task.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../service/token.service';

@Component({
  selector: 'app-task-update',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './task-update.component.html',
  styleUrls: ['./task-update.component.css']
})
export class TaskUpdateComponent implements OnInit {

  updateTaskForm: FormGroup;
  tasks: { id: number; tittle: string }[] = [];
  users: { id: number; name: string }[] = [];
  message: string | null = null;
  selectedTask: any = null; // Selected task for update

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.updateTaskForm = this.fb.group({
      taskId: ['', [Validators.required]],
      tittle: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: ['', [Validators.required]],
      userId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadTasks();
    this.loadUsers();
  }

  private loadTasks(): void {
    this.taskService.loadTasks((tasks) => {
      this.tasks = tasks;
    });
  }
  /**
   * Loads the users available for task assignment.
   */
  private loadUsers(): void {
    const token = this.tokenService.getToken();
    if (!token) {
      this.message = 'No valid token found';
      return;
    }

    this.taskService.getUsers(token).subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        this.message = 'Failed to load users.';
        console.error('Error loading users:', error);
      }
    });
  }

  /**
   * Handles the form submission to update the task.
   */
  onSubmit(): void {
    if (this.updateTaskForm.invalid) {
      this.message = 'Invalid input';
      return;
    }

    const taskData = this.updateTaskForm.value;
    const token = this.tokenService.getToken();

    if (!token) {
      this.message = 'No valid token found';
      return;
    }

    const updatedTaskData = {
      tittle: taskData.tittle,
      description: taskData.description,
      status: taskData.status,
      user: +taskData.userId
    };

    this.taskService.updateTask(taskData.taskId, updatedTaskData, token).subscribe({
      next: () => {
        this.message = 'Task updated successfully!';
        setTimeout(() => this.router.navigate(['/task-list']), 1000);
      },
      error: (error) => {
        this.message =
          error.status === 401
            ? 'Unauthorized - Invalid token'
            : 'Error updating the task.';
        console.error('Error updating task:', error);
      }
    });
  }

  /**
   * Handles the change in the task selection.
   * It now uses the service to fetch the details of the selected task.
   */
  onTaskSelect(): void {
    const selectedTaskId = this.updateTaskForm.value.taskId;
    if (selectedTaskId) {
      const token = this.tokenService.getToken();
      if (!token) {
        this.message = 'No valid token found';
        return;
      }

      this.taskService.getTaskById(selectedTaskId).subscribe({
        next: (task) => {
          // Updates the form with the selected task details
          this.selectedTask = task;
          this.updateTaskForm.patchValue({
            tittle: this.selectedTask.tittle,
            description: this.selectedTask.description,
            status: this.selectedTask.status,
            userId: this.selectedTask.user.id  // Access the user's ID here
          });
        },
        error: (error) => {
          this.message = 'Error fetching task details.';
          console.error('Error fetching task details:', error);
        }
      });
    }
  }

}
