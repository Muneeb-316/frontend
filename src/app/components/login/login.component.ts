import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };
  
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(form: NgForm): void {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';
    
    // Validate form
    if (form.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }
    
    // Show loading state
    this.isLoading = true;
    
    // Call authentication service
    this.authService.login(this.loginData.email, this.loginData.password)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastr.success('Login successful!');
          
          // Handle remember me functionality
          if (this.loginData.rememberMe) {
            localStorage.setItem('rememberedEmail', this.loginData.email);
          } else {
            localStorage.removeItem('rememberedEmail');
          }
          
          // Redirect to dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Login failed. Please try again.';
          this.toastr.error(this.errorMessage);
        }
      });
  }

  forgotPassword(): void {
    // In a real app, this would navigate to a password reset page
    this.toastr.info('Password reset functionality would be implemented here');
    // this.router.navigate(['/forgot-password']);
  }
}