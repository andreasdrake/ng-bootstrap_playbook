import { Component, OnInit } from '@angular/core';
import { WorkoutsApiService } from '../services/workouts-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators'
import { Observable } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-entry-editor',
  templateUrl: './entry-editor.component.html',
  styleUrls: ['./entry-editor.component.css']
})
export class EntryEditorComponent implements OnInit {

  public workout: any = {};
  public loading = false;
  public startDate: any;
  public maxDate: NgbDateStruct;

  public locations = [];

  constructor(private router: ActivatedRoute,
    private nav: Router,
    private api: WorkoutsApiService) {
      let today = new Date();
      this.maxDate = NgbDate.from({year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() + 1});
    }

  ngOnInit() {
    // this.api.getLocations().subscribe(data => this.locations = data);

    this.router.params.subscribe(params =>{
      if (params.id !== 'new'){
        this.loading = true;
        this.api.getWorkout(params.id).subscribe(data => {
          this.workout = data;
          let d = new Date(this.workout.date);
          this.startDate={year: d.getFullYear(), month: d.getMonth() + 1};
          this.loading = false;
        })
      }
    });
  }

  locationSearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => this.loading = true),
      switchMap(term => this.api.searchLocations(term)),
      map(locations => _.map(locations, 'name')),
      tap(() => this.loading = false)
    );
  
  locationsFormmatter = (result) => result.name;

  save(){
    this.loading = true;
    this.api.saveWorkout(this.workout).subscribe(data =>{
      this.loading = false;
      this.nav.navigate(['/workouts']);
    });
  }

}
