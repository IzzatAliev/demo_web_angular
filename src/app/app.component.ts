import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from './enum/data-state.enum';
import { AppState } from './interface/app-state';
import { CustomResponse } from './interface/custome-response';
import { CourseService } from './service/course.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  appState$: Observable<AppState<CustomResponse>>;
  title = 'demo-web';
  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.appState$ = this.courseService.courses$
    .pipe(
      map(response => {
        return {
          dataState: DataState.LOADED_STATE, appData: response
        }
      }),
      startWith({dataState: DataState.LOADING_STATE}),
      catchError((error: string) => {
        return of ({
          dataState: DataState.ERROR_STATE, error
        })
      })
      );
  }
}
