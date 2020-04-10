import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable()
export class DataInterceptor implements HttpInterceptor {
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(new HttpResponse({status: 200, body: request.body}));
    }
}
