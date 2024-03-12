import { Component } from '@angular/core';
import { Router } from '@angular/router';
import UserResponse from '@dto/types/User/UserResponse';
import { SurveyDataService } from '../../services/SurveyDataService.service';
import { MessageService } from 'primeng/api';
import SurveyDefinition from '@dto/types/Survey/SurveyDefinition';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [MessageService],
})

export class DashboardComponent{
  constructor(private router: Router, private SurveyDataService: SurveyDataService, private toastService: MessageService) {}

  user: UserResponse = {} as UserResponse;
  isLoading: boolean = false;
  surveys: SurveyDefinition[] = [];

  ngOnInit() {
    this.getUserData();
    this.getSurveysForUser();
  }

  getUserData() {
    const userData = localStorage.getItem('user');
    if (userData)
      this.user = JSON.parse(userData);
    else 
      this.router.navigate(['/']);
  }

  getSurveysForUser() {
    this.isLoading = true;
    this.SurveyDataService.getSurveysForUser().subscribe({
      next: data => {
        console.log(data);
        this.surveys = data.payload.surveys;
        console.log(this.surveys);
      },
      error: error => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Server error. Please try again.' });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}