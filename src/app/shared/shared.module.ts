import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { PaginationComponent } from './component/pagination/pagination.component';
import { LandigPageComponent } from './component/landig-page/landig-page.component';
import { ButtonComponent } from './component/button/button.component';
import { AdminLayoutModule } from './component/layout/admin-layout/admin-layout.module';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { LineGraphComponent } from './line-graph/line-graph.component';
import { MaterialModule } from '../material.module';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LoadingComponent } from './loading/loading.component';
import { CountUpDirective } from './count-up.directive';
import { DatasetsComponent } from './datasets/datasets.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectSearchComponent} from "./component/custom-form-fields/mat-select-search/mat-select-search.component";


@NgModule({
    declarations: [

        NavBarComponent,
        PaginationComponent,
        ButtonComponent,
        DonutChartComponent,
        LineGraphComponent,
        CountUpDirective,
        LoadingComponent,
        LandigPageComponent,
        DatasetsComponent,
        MatSelectSearchComponent

    ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    AdminLayoutModule,
    MaterialModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
    exports: [
        PaginationComponent,
        NavBarComponent,
        LandigPageComponent,
        AdminLayoutModule,
        DonutChartComponent,
        LineGraphComponent,
        LoadingComponent,
        CountUpDirective,
        DatasetsComponent,
        MatSelectSearchComponent
    ]
})
export class SharedModule {}
