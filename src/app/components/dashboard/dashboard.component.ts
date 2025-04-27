import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../models/project.interface';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service'; // Import AuthService
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  activeTab: 'all' | 'in-progress' | 'completed' | 'on-hold' = 'all';
  showAddProject = false;
  newProject: Omit<Project, 'id'> = {
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    status: 'In Progress',
    materials: [],
    budget: 0,
    location: ''
  };

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private authService: AuthService, // Add AuthService
    private toastr: ToastrService // Add ToastrService
  ) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe(
      projects => this.projects = projects
    );
  }

  viewProjectDetails(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }

  getProjectsByStatus(status: string): Project[] {
    return this.projects.filter(project => project.status === status);
  }

  getFilteredProjects(): Project[] {
    if (this.activeTab === 'all') {
      return this.projects;
    }

    const statusMap: Record<Exclude<typeof this.activeTab, 'all'>, string> = {
      'in-progress': 'In Progress',
      'completed': 'Completed',
      'on-hold': 'On Hold'
    };

    return this.projects.filter(project => project.status === statusMap[this.activeTab as Exclude<typeof this.activeTab, 'all'>]);
  }

  createProject(): void {
    if (this.validateForm()) {
      this.projectService.createProject(this.newProject).subscribe(
        (project: Project) => {
          this.loadProjects();
          this.showAddProject = false;
          this.resetForm();
        }
      );
    }
  }

  logout(): void {
    this.authService.logout(); // Call the logout method from AuthService
    this.toastr.success('Logged out successfully'); // Show success message
    // No need to navigate here as AuthService's logout already handles navigation
  }

  private validateForm(): boolean {
    return !!(
      this.newProject.name &&
      this.newProject.description &&
      this.newProject.startDate &&
      this.newProject.endDate &&
      this.newProject.budget > 0 &&
      this.newProject.location
    );
  }

  private resetForm(): void {
    this.newProject = {
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      status: 'In Progress',
      materials: [],
      budget: 0,
      location: ''
    };
  }
}