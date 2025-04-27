import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Project, Material } from '../../models/project.interface';
import { ProjectService } from '../../services/project.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit {
  project: Project | null = null;
  materialTypes: string[] = [
    'Bricks', 'Steel', 'Cement', 'Glass', 'Concrete', 'Wood', 'Paint', 'Tiles',
    'Electrical Wiring', 'Plumbing Pipes', 'Drywall', 'Insulation', 'Roofing',
    'Windows', 'Doors', 'Flooring', 'HVAC Components', 'Lighting Fixtures'
  ];
  showDeleteConfirmation = false;
  showEditForm = false;
  showAddMaterialType = false;
  showAddCategory = false;
  showAddMaterialForm = false;
  showDeleteMaterialTypeConfirmation = false;
  showDeleteCategoryConfirmation = false;
  materialTypeToDelete: string | null = null;
  categoryToDelete: string | null = null;
  newMaterialType = '';
  newCategory = '';
  materialToDelete: Material | null = null;
  editingMaterial: Material | null = null;
  isLoading = false;
  errorMessage = '';

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPagesCount = 1;

  newMaterial: Material = {
    type: '',
    quantity: 0,
    unit: '',
    date: new Date().toISOString().split('T')[0],
    price: 0,
    category: 'Other'
  };

  selectedFilter = 'all';
  searchQuery = '';
  categories = ['All Materials', 'Structural', 'Finishing', 'Electrical', 'Plumbing', 'Other'];
  selectedCategory = 'All Materials';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.loadProject();
  }

  loadProject(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.projectService.getProject(projectId).subscribe({
        next: (project) => {
          if (project) {
            this.project = project;
            this.materialTypes = Array.from(new Set(project.materials.map(m => m.type)));
          }
          this.isLoading = false;
        },
        error: (error: unknown) => {
          this.errorMessage = 'Failed to load project details. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  addMaterial(): void {
    if (this.project && this.newMaterial.type && this.newMaterial.quantity > 0 && this.newMaterial.unit && this.newMaterial.price > 0) {
      this.isLoading = true;
      this.errorMessage = '';
      const materialToAdd: Material = {
        ...this.newMaterial,
        date: new Date().toISOString().split('T')[0]
      };
      this.projectService.addMaterialToProject(this.project.id, materialToAdd).subscribe({
        next: (success: boolean) => {
          if (success) {
            this.newMaterial = {
              type: '',
              quantity: 0,
              unit: '',
              date: new Date().toISOString().split('T')[0],
              price: 0,
              category: 'Other'
            };
            this.loadProject();
          }
          this.isLoading = false;
        },
        error: (error: unknown) => {
          this.errorMessage = 'Failed to add material. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  confirmDelete(material: Material): void {
    this.materialToDelete = material;
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.materialToDelete = null;
  }

  deleteMaterial(): void {
    if (this.project && this.materialToDelete) {
      this.isLoading = true;
      this.errorMessage = '';
      this.projectService.deleteMaterialFromProject(this.project.id, this.materialToDelete).subscribe({
        next: (success: boolean) => {
          if (success) {
            this.showDeleteConfirmation = false;
            this.materialToDelete = null;
            this.loadProject();
          }
          this.isLoading = false;
        },
        error: (error: unknown) => {
          this.errorMessage = 'Failed to delete material. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  editMaterial(material: Material): void {
    this.editingMaterial = { ...material };
    this.showEditForm = true;
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.editingMaterial = null;
  }

  saveEdit(): void {
    if (this.project && this.editingMaterial) {
      this.isLoading = true;
      this.errorMessage = '';
      this.projectService.updateMaterialInProject(this.project.id, this.editingMaterial).subscribe({
        next: (success: boolean) => {
          if (success) {
            this.showEditForm = false;
            this.editingMaterial = null;
            this.loadProject();
          }
          this.isLoading = false;
        },
        error: (error: unknown) => {
          this.errorMessage = 'Failed to update material. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  get paginatedMaterials(): Material[] {
    if (!this.project) return [];
    
    let filteredMaterials = [...this.project.materials];
    
    // Apply category filter
    if (this.selectedCategory !== 'All Materials') {
      filteredMaterials = filteredMaterials.filter(m => m.category === this.selectedCategory);
    }
    
    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filteredMaterials = filteredMaterials.filter(m => 
        m.type.toLowerCase().includes(query) ||
        m.category.toLowerCase().includes(query)
      );
    }

    this.totalItems = filteredMaterials.length;
    this.totalPagesCount = Math.ceil(this.totalItems / this.itemsPerPage);
    
    // Ensure current page is valid
    if (this.currentPage > this.totalPagesCount) {
      this.currentPage = this.totalPagesCount;
    }
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    return filteredMaterials.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPagesCount) {
      this.currentPage = page;
    }
  }

  get totalCost(): number {
    return this.paginatedMaterials.reduce((sum, material) => sum + (material.quantity * material.price), 0);
  }

  addNewMaterialType(): void {
    if (this.newMaterialType.trim() && !this.materialTypes.includes(this.newMaterialType.trim())) {
      this.materialTypes.push(this.newMaterialType.trim());
      this.newMaterialType = '';
      this.showAddMaterialType = false;
    }
  }

  removeMaterialType(type: string): void {
    const index = this.materialTypes.indexOf(type);
    if (index > -1) {
      this.materialTypes.splice(index, 1);
    }
  }

  onMaterialTypeChange(): void {
    if (this.newMaterial.type) {
      // You can add any additional logic here when a material type is selected
      // For example, setting default values based on the selected type
    }
  }

  addNewCategory(): void {
    if (this.newCategory.trim() && !this.categories.includes(this.newCategory.trim())) {
      this.categories.push(this.newCategory.trim());
      this.newCategory = '';
      this.showAddCategory = false;
    }
  }

  get totalPages(): number[] {
    return Array.from({ length: Math.ceil(this.totalItems / this.itemsPerPage) }, (_, i) => i + 1);
  }

  confirmDeleteMaterialType(type: string): void {
    this.materialTypeToDelete = type;
    this.showDeleteMaterialTypeConfirmation = true;
  }

  confirmDeleteCategory(category: string): void {
    this.categoryToDelete = category;
    this.showDeleteCategoryConfirmation = true;
  }

  deleteMaterialType(): void {
    if (this.materialTypeToDelete) {
      this.removeMaterialType(this.materialTypeToDelete);
      this.showDeleteMaterialTypeConfirmation = false;
      this.materialTypeToDelete = null;
    }
  }

  deleteCategory(): void {
    if (this.categoryToDelete) {
      const index = this.categories.indexOf(this.categoryToDelete);
      if (index > -1) {
        this.categories.splice(index, 1);
      }
      this.showDeleteCategoryConfirmation = false;
      this.categoryToDelete = null;
    }
  }

  cancelDeleteMaterialType(): void {
    this.showDeleteMaterialTypeConfirmation = false;
    this.materialTypeToDelete = null;
  }

  cancelDeleteCategory(): void {
    this.showDeleteCategoryConfirmation = false;
    this.categoryToDelete = null;
  }
}

