import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project, Material } from '../models/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [
    {
      id: '1',
      name: 'Residential Building',
      description: 'Construction of a 3-story residential building',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      status: 'In Progress',
      budget: 500000,
      location: 'New York',
      materials: [
        { type: 'Bricks', quantity: 5000, unit: 'pieces', date: '2024-01-20', price: 2.5, category: 'Structural' },
        { type: 'Steel', quantity: 2000, unit: 'kg', date: '2024-01-25', price: 15, category: 'Structural' },
        { type: 'Cement', quantity: 100, unit: 'bags', date: '2024-02-01', price: 12, category: 'Structural' },
        { type: 'Glass', quantity: 50, unit: 'panels', date: '2024-02-15', price: 200, category: 'Finishing' },
        { type: 'Concrete', quantity: 2000, unit: 'cubic meters', date: '2024-02-20', price: 75, category: 'Structural' },
        { type: 'Wood', quantity: 500, unit: 'boards', date: '2024-03-01', price: 45, category: 'Structural' },
        { type: 'Paint', quantity: 100, unit: 'gallons', date: '2024-03-15', price: 35, category: 'Finishing' },
        { type: 'Tiles', quantity: 200, unit: 'boxes', date: '2024-03-20', price: 40, category: 'Finishing' }
      ]
    },
    {
      id: '2',
      name: 'Office Complex',
      description: 'Modern office building with 5 floors',
      startDate: '2024-02-01',
      endDate: '2025-06-30',
      status: 'In Progress',
      budget: 800000,
      location: 'Los Angeles',
      materials: [
        { type: 'Steel', quantity: 3000, unit: 'kg', date: '2024-02-10', price: 15, category: 'Structural' },
        { type: 'Concrete', quantity: 3000, unit: 'cubic meters', date: '2024-02-15', price: 75, category: 'Structural' },
        { type: 'Glass', quantity: 100, unit: 'panels', date: '2024-03-01', price: 200, category: 'Finishing' },
        { type: 'Electrical Wiring', quantity: 5000, unit: 'meters', date: '2024-03-10', price: 5, category: 'Electrical' },
        { type: 'Plumbing Pipes', quantity: 2000, unit: 'meters', date: '2024-03-15', price: 8, category: 'Plumbing' }
      ]
    },
    {
      id: '3',
      name: 'Shopping Mall',
      description: 'Large shopping complex with parking',
      startDate: '2024-03-01',
      endDate: '2025-12-31',
      status: 'On Hold',
      budget: 1200000,
      location: 'Chicago',
      materials: [
        { type: 'Concrete', quantity: 5000, unit: 'cubic meters', date: '2024-03-10', price: 75, category: 'Structural' },
        { type: 'Steel', quantity: 4000, unit: 'kg', date: '2024-03-15', price: 15, category: 'Structural' },
        { type: 'Glass', quantity: 200, unit: 'panels', date: '2024-03-20', price: 200, category: 'Finishing' }
      ]
    }
  ];

  constructor() { }

  getProjects(): Observable<Project[]> {
    return of(this.projects);
  }

  getProject(id: string): Observable<Project | undefined> {
    return of(this.projects.find(project => project.id === id));
  }

  createProject(project: Omit<Project, 'id'>): Observable<Project> {
    const newProject: Project = {
      ...project,
      id: (this.projects.length + 1).toString()
    };
    this.projects.push(newProject);
    return of(newProject);
  }

  addMaterialToProject(projectId: string, material: Material): Observable<boolean> {
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      project.materials.push(material);
      return of(true);
    }
    return of(false);
  }

  deleteMaterialFromProject(projectId: string, material: Material): Observable<boolean> {
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      const index = project.materials.findIndex(m => 
        m.type === material.type && 
        m.date === material.date && 
        m.quantity === material.quantity
      );
      if (index !== -1) {
        project.materials.splice(index, 1);
        return of(true);
      }
    }
    return of(false);
  }

  updateMaterialInProject(projectId: string, updatedMaterial: Material): Observable<boolean> {
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      const index = project.materials.findIndex(m => 
        m.type === updatedMaterial.type && 
        m.date === updatedMaterial.date
      );
      if (index !== -1) {
        project.materials[index] = updatedMaterial;
        return of(true);
      }
    }
    return of(false);
  }
}
