import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Header } from 'primeng/api';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface DatasetFeedback {
  id?: number;
  content: string;
  user: number;
  dataset?: number;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})

export class DatasetService {

  private APIUrl = environment.apiUrl; // Replace with your API endpoint
  private url="";
  constructor(private http: HttpClient, private router: Router) {}

  getToken(){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
    });
    return {"headers":headers,  "token":token}
  }

getAllDatasets(page: number, query: any, categories: any, myDataset: boolean): Observable<any> {
  this.url = this.APIUrl + "/dataset/list/";
  const token = this.getToken().token;
  const headers = this.getToken().headers;
  let options = {};
  if (token && headers) {
    options = { headers: headers };
  }
  return this.http.get<any>(`${this.url}?page=${page}&query=${query}&categories=${categories}&my_dataset=${myDataset}`, options).pipe(
    map((response: { results: any; }) => response.results)
  );
}

  getFolders(parentFolderId: number, page: number, datasetId: number): Observable<any> {
    return this.http.get<any>(`${this.APIUrl}/folders/${parentFolderId}/${datasetId}/?page=${page}`);
  }

  getFiles(folderId: number, page: number): Observable<any> {
    return this.http.get<any>(`${this.APIUrl}/files/${folderId}/?page=${page}`);
  }



  getAllUsers(){
    this.url = this.APIUrl + "/auth/all-users/";
    return this.http.get<any>(this.url)
  }


  createNewDataUser(datasetId: number , userId:number): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (!token) {
      return throwError('No token found'); // Handle case where token is not available
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.post<any>(`${this.APIUrl}/auth/share_data_set/`, { dataset_id: datasetId , user_id:userId }, { headers: headers })
      .pipe(
        catchError(error => {
          return throwError(error); // Handle error
        })
      );
  }



  getDatasetDownloadsPerDay(datasetId: number): Observable<any> {
    return this.http.get(`${this.APIUrl}/dataset-downloads/${datasetId}/`);
  }

  getRegions(){
    this.url = this.APIUrl + "/auth/region/";
    return this.http.get<any>(this.url)
  }

  downloadFile(fileId: number) {
    return this.http.get(`${this.APIUrl}/files/${fileId}/download/`, {
      responseType: 'blob' // Set response type to blob for downloading files
    });
  }
  
  viewFile(fileId: string): Observable<Blob> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${this.APIUrl}/files/${fileId}/view/`, { responseType: 'blob', headers: headers });
  }

  updateDownloads(id:number){
    const url = `${this.APIUrl}/datasets/downloads/update/${id}/`;
    return this.http.get(url );
  }



  getChatsFromChatRoom(datasetId: number): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (!token) {
      return throwError('No token found'); // Handle case where token is not available
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.post<any>(`${this.APIUrl}/auth/get_chat_messages/`, { data_set_id: datasetId }, { headers: headers })
      .pipe(
        catchError(error => {
          return throwError(error); // Handle error
        })
      );
  }


  createChatsFromChatRoom(datasetId: number , message:string): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (!token) {
      return throwError('No token found'); // Handle case where token is not available
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.post<any>(`${this.APIUrl}/auth/create_chat_message/`, { data_set_id: datasetId  , message:message}, { headers: headers })
      .pipe(
        catchError(error => {
          return throwError(error); // Handle error
        })
      );
  }

  updateViewers(id:number){
    const url = `${this.APIUrl}/datasets/viewers/update/${id}/`;
    const headers = this.getToken().headers;
    const token = this.getToken();
    if(token.token){
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

  upvoteDataset(datasetId: number): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (!token) {
      return throwError('No token found'); // Handle case where token is not available
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.post<any>(`${this.APIUrl}/upvote-dataset/`, { dataset: datasetId }, { headers: headers })
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
  
  datasetDetails(id:number){
    const url = `${this.APIUrl}/dataset-details/${id}/`;
    return this.http.get(url);
  }

  deleteDataset(datasetId: number): Observable<any> {
    return this.http.delete(`${this.APIUrl}/delete_dataset/${datasetId}/`);
  }
  
  deleteDatasetFile(datasetId: number): Observable<any> {
    return this.http.delete(`${this.APIUrl}/delete-dataset-file/${datasetId}/`);
  }

  downloadDataset(datasetId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
    });
    const url = `${this.APIUrl}/download-dataset/${datasetId}/`;
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
    return this.http.post(`${this.APIUrl}/dataset-file-update/${fileId}/`, file);
  }

  uploadDataset(formData: FormData, token: string | null) {
    console.log("I reach here");
    if (token) {
      console.log(token);
      const headers = new HttpHeaders({
        'Authorization': `Token ${token}`,
      });
      this.url = this.APIUrl + "/dataset-repo-upload/"
      return this.http.post<any>(this.url, formData, { headers });
    } else {
      return;
    }
  }

  getOwnedDatasets(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': `Token ${localStorage.getItem('token')}` })
    };

    return this.http.get<any>(this.APIUrl + '/mydatasets/', httpOptions)
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
