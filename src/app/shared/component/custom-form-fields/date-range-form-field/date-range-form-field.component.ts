import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {SettingsService} from '../../../../services/settings.service';

@Component({
    selector: 'app-date-range-form-field',
    templateUrl: './date-range-form-field.component.html',
    styleUrls: ['./date-range-form-field.component.scss'],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        multi:true,
        useExisting: DateRangeFormFieldComponent
      }
    ],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DateRangeFormFieldComponent implements OnInit, OnDestroy {

  @Input() label = 'Select Date Range';
  @Input() isCustomField = true;
  @Input() useFullWidth = false;

  settingsService = inject(SettingsService);

  startDate = this.settingsService.getStartDate();

  endDate = new DatePipe('en-Gb').transform(new Date(), 'yyyy-MM-dd');
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  subscriptions: Subscription = new Subscription();

  @Output() selectedValue = new EventEmitter<{ startDate: string, endDate: string }>();

  ngOnInit() {
    this.selectedValue.emit({startDate: this.startDate, endDate: this.endDate});

    this.subscriptions.add(
      this.range.valueChanges.subscribe( dates => {
        if (dates?.start && dates?.end){
          this.startDate = new DatePipe('en-Gb').transform(dates?.start, 'yyyy-MM-dd');
          this.endDate = new DatePipe('en-Gb').transform(dates?.end, 'yyyy-MM-dd');

          this.selectedValue.emit({startDate: this.startDate, endDate: this.endDate});
        }
      })
    );

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  generateDateRange(days: number) {

    this.startDate = new DatePipe('en-Gb').transform(
      new Date().setDate(new Date().getDate() - days), 'yyyy-MM-dd');

    this.endDate = new DatePipe('en-Gb').transform(new Date(), 'yyyy-MM-dd');

    this.selectedValue.emit({startDate: this.startDate, endDate: this.endDate});
  }
}
