import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import { MaterialModule } from 'src/app/material.module';
import { ToastrModule } from 'ngx-toastr';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TreeModule } from 'primeng/tree';
import { NgxDocViewerModule } from 'ngx-doc-viewer'; 
import { ChipsModule } from 'primeng/chips';
import { ModelListComponent } from './model-list/model-list.component';
import { ModelUploadComponent } from './model-upload/model-upload.component';
import { ModelsRoutingModule } from './models-routing.module';
import { ModelViewComponent } from './model-list/model-view/model-view.component';
import { MyModelsComponent } from './my-models/my-models.component';

@NgModule({
  declarations: [
    ModelListComponent,
    ModelUploadComponent,
    ModelViewComponent,
    MyModelsComponent,
  ],
  imports: [
    CommonModule,
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
    ModelsRoutingModule,
    NgxDocViewerModule,
    ToastrModule.forRoot(),
  ],
})

export class ModelsModule { }
