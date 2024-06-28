import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatasetsRoutingModule } from './datasets-routing.module';
import { DatasetsListComponent } from './datasets-list/datasets-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DatasetViewComponent } from './datasets-list/dataset-view/dataset-view.component';
import { UploadDatasetComponent } from './upload-dataset/upload-dataset.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import { MydatasetComponent } from './mydataset/mydataset.component';
import { DatasetUploadComponent } from './dataset-upload/dataset-upload.component';
import { MaterialModule } from 'src/app/material.module';
import { ToastrModule } from 'ngx-toastr';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TreeModule } from 'primeng/tree';
import { NgxDocViewerModule } from 'ngx-doc-viewer'; 
import { ChipsModule } from 'primeng/chips';

@NgModule({
  declarations: [
    DatasetsListComponent,
    DatasetViewComponent,
    UploadDatasetComponent,
    DatasetUploadComponent,
    MydatasetComponent,
  ],
  imports: [
    CommonModule,
    DatasetsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MaterialModule,
    MatTooltipModule,
    TreeModule,
    ChipsModule,
    NgxDocViewerModule,
    ToastrModule.forRoot(),
  ],
})
export class DatasetsModule { }
