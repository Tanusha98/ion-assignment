import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpErrorResponse,
  HttpEventType,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  SERVER_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}
  upload(
    file: File
  ): { [key: string]: { progress: Observable<number> } } {
    const url = `${this.SERVER_URL}/upload`;
    const status: { [key: string]: { progress: Observable<number> } } = {};

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true
    });

    const progress = new Subject<number>();

    this.http.request(req).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round((100 * event.loaded) / event.total);

        progress.next(percentDone);
      } else if (event instanceof HttpResponse) {
        progress.complete();
      }
    });

    status[file.name] = {
      progress: progress.asObservable()
    };

    return status;
  }
}
