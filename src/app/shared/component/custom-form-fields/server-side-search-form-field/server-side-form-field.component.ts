import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {NgxPermissionsService} from 'ngx-permissions';
import {Apollo} from 'apollo-angular';
import {MemoizedSelector, Store} from '@ngrx/store';
import {Observable, Subject, Subscription} from 'rxjs';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl} from '@angular/forms';
import {MatSelect} from '@angular/material/select';
import {take, takeUntil} from 'rxjs/operators';
import {
  INITIALIZED_PAGEABLE_PARAMETER,
  PageableParamInput,
  SearchFieldsDtoInput
} from 'src/app/store/entities/settings/page/page.model';
import {AppState} from 'src/app/store';

@Component({
    selector: 'app-server-side-form-field',
    templateUrl: './server-side-form-field.component.html',
    styleUrls: ['./server-side-form-field.component.scss'],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        multi:true,
        useExisting: ServerSideFormFieldComponent
      }
    ],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ServerSideFormFieldComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() label = 'Title Here';
  @Input() storeAction: any;
  @Input() displayColumn: any = 'title';
  @Input() storeSelect: MemoizedSelector<AppState, any>;
  @Input() searchFields: SearchFieldsDtoInput[];

  pageable: PageableParamInput = INITIALIZED_PAGEABLE_PARAMETER;
  filterCtrl: UntypedFormControl = new UntypedFormControl();
  @ViewChild('select', { static: true }) select: MatSelect;

  data$: Observable<any[]>;

  @Input() storeActionProps: any = {pageableParam: this.pageable, active: true};

  private valueData: string;
  @Output() selectedValue = new EventEmitter<any>();
  private change = new EventEmitter<any>();

  subscriptions: Subscription = new Subscription();
  protected onDestroy = new Subject<void>();

  constructor(
    private ngxPermissionsService: NgxPermissionsService,
    private apollo: Apollo,
    private store: Store<AppState>
  ) {
  }

  ngOnInit() {
    this.loadData();
  }

  get value(): string {
    return this.valueData;
  }

  onTouched(fn) {
    return fn;
  }

  onChange(fn){
    return fn;
  }

  onSearch(event: any) {
    if (event !== null){
      this.pageable = {
        ...this.pageable,
        searchFields: this.searchFields?.map( (searchField) => {
          return {
            fieldName: searchField?.fieldName,
            searchType: searchField?.searchType,
            fieldValue: event.trim().toLowerCase(),
          };
        })
      };

      this.storeActionProps = {
        ...this.storeActionProps,
        pageableParam: this.pageable
      }
    }
    this.loadData();
    this.subscriptions.add(
      this.data$
        .pipe(take(1), takeUntil(this.onDestroy))
        .subscribe(() => {
          if (this.select !== undefined){
            this.select.compareWith = (a: any, b: any) => a && b;
          }
        })
    );
  }

  loadData() {
    this.store.dispatch(this.storeAction(this.storeActionProps))
    this.data$ = this.store.select(this.storeSelect);
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
    this.subscriptions.unsubscribe();
  }

  writeValue(value: string) {
    const valueChanged = value !== this.valueData;
    if (valueChanged) {
      this.valueData = value;
      this.change.emit(value);
    }
  }

  onSelectionChange(value) {
    const valueChanged = value !== this.valueData;
    if (valueChanged) {
      this.valueData = value;
      this.onChange(value);
      this.change.emit(value);
      this.selectedValue.emit(value);
    }
  }

  onBlur(value: string) {
    this.writeValue(value);
    this.onTouched(value);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

}
