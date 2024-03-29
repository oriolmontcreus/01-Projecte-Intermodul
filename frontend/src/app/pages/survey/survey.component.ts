import { Component, OnInit } from '@angular/core';
import AnswerDefinition from '@dto/types/Survey/AnswerDefinition';
import QuestionDefinition from '@dto/types/Survey/QuestionDefinition';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SurveyDataService } from '../../services/SurveyDataService.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.css',
  providers: [MessageService],
})

export class SurveyComponent implements OnInit{

  constructor(
    private surveyDataService: SurveyDataService,
    private toastService: MessageService,
    private route: ActivatedRoute
  ) {}

  idSurvey: number = 0;
  isLoading: boolean = false;

  answers: AnswerDefinition[] = []
  questions: QuestionDefinition[] = [];
  surveyTitle: string = '';

  async ngOnInit() {
    try {
      this.route.paramMap.subscribe(async (params: ParamMap) => {
        this.idSurvey = Number(params.get('id'));
        this.initializeAnswers(await this.getSurveyGivenId(this.idSurvey));
      });
    } catch (error) {
      console.error(error);
    }
  }

  initializeAnswers(questions: QuestionDefinition[]) {
    this.answers = questions.map(question => ({
      id: question.id,
      question: question.question,
      type: question.type,
      answer: question.type === 'range' && question.min !== undefined && question.max !== undefined 
      ? [question.min.toString(), question.max.toString()] 
      : [],
    }));
  }

  async getSurveyGivenId(idSurvey: number): Promise<QuestionDefinition[]> {
    this.isLoading = true;
    return new Promise((resolve, reject) => {
      this.surveyDataService.getSurveyGivenId(idSurvey).subscribe({
        next: data => {
          this.questions = data.payload.survey.questions;
          this.surveyTitle = data.payload.survey.descr;
          resolve(this.questions);
        },
        error: () => {
          this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Server error. Please try again.' });
          reject();
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    });
  }

  submitForm() {
    console.log(this.answers);
  }
}

