import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface UserSettings {
  name: string;
  email: string;
  phone: string;
  company: string;
  notifications: {
    email: boolean;
    sms: boolean;
  };
  theme: 'light' | 'dark';
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  settings: UserSettings = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Construction Co.',
    notifications: {
      email: true,
      sms: false
    },
    theme: 'light'
  };

  isSaving = false;
  saveSuccess = false;
  saveError = false;

  constructor() { }

  ngOnInit(): void {
    // In a real app, you would load user settings from a service
    this.loadUserSettings();
  }

  loadUserSettings(): void {
    // Simulate loading settings from a service
    // In a real app, you would call a service to get the user's settings
    console.log('Loading user settings...');
  }

  saveSettings(): void {
    this.isSaving = true;
    this.saveSuccess = false;
    this.saveError = false;

    // Simulate saving settings to a service
    setTimeout(() => {
      // In a real app, you would call a service to save the user's settings
      console.log('Saving settings:', this.settings);
      
      this.isSaving = false;
      this.saveSuccess = true;
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        this.saveSuccess = false;
      }, 3000);
    }, 1000);
  }

  resetSettings(): void {
    // Reset to default settings
    this.settings = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Construction Co.',
      notifications: {
        email: true,
        sms: false
      },
      theme: 'light'
    };
  }
}
