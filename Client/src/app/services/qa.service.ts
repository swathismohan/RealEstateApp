import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { QuestionAnswer } from '../models/qa';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QaService {

  constructor(private httpClient: HttpClient) { }

  postQuestion(newQuestion: QuestionAnswer){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.httpClient.post(
       "http://localhost:3000/question",
       newQuestion,
       httpOptions
    ).pipe(map((res:any) => res.json()));
  }

  addAnswer(QAId: string, answer: string){
    const url = "http://localhost:3000/abc/answered";
    let body = {"QAId" : QAId,
    "answer": answer};
    return this.httpClient.put(
      url,
      body
   ).pipe(map((res:any) => res.json()));

  }

  getQuestionsByUserId(userId: string){
    return this.httpClient.get<any>("http://localhost:3000/questions/"+ userId);
  }

  getUnansweredQuestions(){
    return this.httpClient.get<any>("http://localhost:3000/questions/status/unanswered");
  }

}
