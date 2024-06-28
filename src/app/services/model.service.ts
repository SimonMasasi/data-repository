
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ModelService {
  id?: number;
  content: string;
  user: number;
  model?: number;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})

export class ModelService {

  private APIUrl = environment.apiUrl; // Replace with your API endpoint
  private url="";
  constructor(private http: HttpClient, private router: Router) {}

  getAllModels(page: number, query: any, categories: any): Observable<any> {
    this.url = this.APIUrl + "/model/list/";
    return this.http.get<any>(`${this.url}?page=${page}&query=${query}&categories=${categories}`).pipe(
      map((response: { results: any; }) => response.results)
    );
  }

  getFeedbacks() {
    this.url = this.APIUrl + "/model/popular_models/";
    return this.http.get<any>(this.url)
  }

  getPopularModels(){
    this.url = this.APIUrl + "/model/popular_models/";
    return this.http.get<any>(this.url)
  }
  
  getFolders(parentFolderId: number, page: number, modelId: number): Observable<any> {
    return this.http.get<any>(`${this.APIUrl}/model/folders/${parentFolderId}/${modelId}/?page=${page}`);
  }

  getFiles(folderId: number, page: number): Observable<any> {
    return this.http.get<any>(`${this.APIUrl}/model/files/${folderId}/?page=${page}`);
  }

  searchModels(query: any){
    this.url = this.APIUrl + `/model/search?query=${query}`
    return this.http.get<any>(this.url);
  }

  getModelDownloadsPerDay(modelId: number): Observable<any> {
    return this.http.get(`${this.APIUrl}/model/model-downloads/${modelId}/`);
  }
  

  downloadFile(fileId: number) {
    return this.http.get(`${this.APIUrl}/model/files/${fileId}/download/`, {
      responseType: 'blob' // Set response type to blob for downloading files
    });
  }
  
  viewFile(fileId: string): Observable<Blob> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${this.APIUrl}/model/files/${fileId}/view/`, { responseType: 'blob', headers: headers });
  }

  updateDownloads(id:number){
    const url = `${this.APIUrl}/model/downloads/update/${id}/`;
    return this.http.get(url);
  }


  getChatsFromChatRoom(modelId: number): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (!token) {
      return throwError('No token found'); // Handle case where token is not available
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.post<any>(`${this.APIUrl}/auth/get_model_chat_messages/`, { model_id: modelId }, { headers: headers })
      .pipe(
        catchError(error => {
          return throwError(error); // Handle error
        })
      );
  }


  createChatsFromChatRoom(modelId: number , message:string): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (!token) {
      return throwError('No token found'); // Handle case where token is not available
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.post<any>(`${this.APIUrl}/auth/create_model_chat_message/`, { model_id: modelId  , message:message}, { headers: headers })
      .pipe(
        catchError(error => {
          return throwError(error); // Handle error
        })
      );
  }

  updateViewers(id:number){
    const url = `${this.APIUrl}/model/viewers/update/${id}/`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
    });
    if(token){
      return this.http.get(url, { observe: 'response', responseType: 'blob', headers })
        .pipe(
          catchError(this.handleError)
        );
    }else{
      return this.http.get(url, { observe: 'response', responseType: 'blob'})
      .pipe(
        catchError(this.handleError)
      );
    }

  }

  upvoteModel(modelId: number): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (!token) {
      return throwError('No token found'); // Handle case where token is not available
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.post<any>(`${this.APIUrl}/model/upvote-model/`, { model: modelId }, { headers: headers })
      .pipe(
        catchError(error => {
          return throwError(error); // Handle error
        })
      );
  }

  getDomains(): Observable<any[]> {
    const url = `${this.APIUrl}/domains/`;
    return this.http.get<any[]>(url);
  }
  
  modelDetails(id:number){
    const url = `${this.APIUrl}/model/model-details/${id}/`;
    return this.http.get(url);
  }

  deleteModel(modelId: number): Observable<any> {
    return this.http.delete(`${this.APIUrl}/model/delete_model/${modelId}/`);
  }
  
  deleteModelFile(modelId: number): Observable<any> {
    return this.http.delete(`${this.APIUrl}/model/delete-model-file/${modelId}/`);
  }

  downloadModel(modelId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
    });
    const url = `${this.APIUrl}/model/download-model/${modelId}/`;
    if(token){
      return this.http.get(url, { observe: 'response', responseType: 'blob', headers })
        .pipe(
          catchError(this.handleError)
        );
    }else{
      return this.http.get(url, { observe: 'response', responseType: 'blob'})
      .pipe(
        catchError(this.handleError)
      );
    }
  }
  
  updateFile(fileId: number, file: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/model/model-file-update/${fileId}/`, file);
  }

  uploadModel(formData: FormData, token: string | null) {
    console.log("I reach here");
    if (token) {
      console.log(token);
      const headers = new HttpHeaders({
        'Authorization': `Token ${token}`,
      });
      this.url = this.APIUrl + "/model/model-repo-upload/"
      return this.http.post<any>(this.url, formData, { headers });
    } else {
      return;
    }
  }

  getOwnedModels(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': `Token ${localStorage.getItem('token')}` })
    };

    return this.http.get<any>(this.APIUrl + '/mymodels/', httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  createRepository(repository: any){
    this.url = this.APIUrl + "/repository/create/"
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem('token') // Include token for authentication
      })
    };
    return this.http.post<any>(this.url, repository, httpOptions);
  }

  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = 'An error occurred: ' + error.error.message;
    } else {
      errorMessage = `Backend returned code ${error.status}: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
