import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Status } from '../enum/status.enum';
import { Course } from '../interface/course';
import { CustomResponse } from '../interface/custome-response';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private readonly apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  /*  getCourses(): Observable<CustomResponse> {
    return this.http.get<CustomResponse>('http://localhost:8080/course/list');
  } */

  courses$ = <Observable<CustomResponse>>(
    this.http
      .get<CustomResponse>(`${this.apiUrl}/course/list`)
      .pipe(tap(console.log), catchError(this.handleError))
  );

  save$ = (course: Course) =>
    <Observable<CustomResponse>>(
      this.http
        .post<CustomResponse>('${this.apiUrl}/course/save', course)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  ping$ = (ipAddress: string) =>
    <Observable<CustomResponse>>(
      this.http
        .get<CustomResponse>(`${this.apiUrl}/course/ping/${ipAddress}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  delete$ = (courseId: number) =>
    <Observable<CustomResponse>>(
      this.http
        .delete<CustomResponse>(`${this.apiUrl}/course/delete/${courseId}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  filter$ = (status: Status, response: CustomResponse) =>
    <Observable<CustomResponse>>new Observable<CustomResponse>((subscriber) => {
      console.log(response);
      subscriber.next(
        status === Status.ALL
          ? { ...response, message: `Courses filtered by ${status} status` }
          : {
              ...response,
              message:
                response.data.courses.filter(
                  (course) => course.status === status
                ).length > 0
                  ? `Courses filtered by ${
                      status === Status.COURSE_UP ? 'COURSE_UP' : 'COURSE_DOWN'
                    } status`
                  : `No courses of ${status} found`,
              data: {
                courses: response.data.courses.filter(
                  (course) => course.status === status
                ),
              },
            }
      );
      subscriber.complete();
    }).pipe(tap(console.log), catchError(this.handleError));

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`An error occurred - Error code: ${error.status}`);
  }
}
