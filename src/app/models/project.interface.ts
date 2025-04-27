export interface Material {
  type: string;
  quantity: number;
  unit: string;
  date: string;
  price: number;
  category: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'In Progress' | 'Completed' | 'On Hold';
  materials: Material[];
  budget: number;
  location: string;
} 