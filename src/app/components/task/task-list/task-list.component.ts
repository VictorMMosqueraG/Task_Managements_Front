import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../service/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../../../service/token.service';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  providers:[TaskService],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent  implements OnInit {
  tasks: any[] = [];

  errorMessage: string | null = null;

  filters = {
    tittle: '',
    status: 'All',
    user: '',
    orderBy: 'asc',
    limit: 10,
    offset: 0,
  };

  constructor(
    private taskService: TaskService,
    private tokenService:TokenService,
    private router:Router
  ) {}

  /**
  * Initializes the component and fetches the initial list of tasks.
  */
  ngOnInit(): void {
    this.fetchTasks();
  }

  /**
  * Fetches the list of tasks from the API using the provided filters and token.
  */
  fetchTasks(): void {
    const token = this.tokenService.getToken();
    if (!token) {
      this.errorMessage = 'No valid token found.';
      return;
    }

    this.taskService.getTasks(this.filters, token).subscribe({
      next: (data) => {
        this.tasks = data;
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = `Failed to load tasks. ${error.message}`;
      },
    });
  }

  /**
  * Applies the current filters and fetches the filtered tasks.
  */
  applyFilters(): void {
    this.fetchTasks();
  }

  /**
  * Navigates to the create task page.
  */
  createTask(): void {
    this.router.navigate(['task-create']);
  }

  /**
  * Navigates to the update task page.
  */
  updateTask(): void {
    this.router.navigate(['task-update']);
  }

  /**
  * Navigates to the delete task page.
  */
  deleteTask(): void {
    this.router.navigate(['task-delete']);
  }
}
