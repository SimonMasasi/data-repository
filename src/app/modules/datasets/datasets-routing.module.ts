import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasetsListComponent } from './datasets-list/datasets-list.component';
import { DatasetViewComponent } from './datasets-list/dataset-view/dataset-view.component';
import { UploadDatasetComponent } from './upload-dataset/upload-dataset.component';
import { DatasetUploadComponent } from './dataset-upload/dataset-upload.component';
import { MydatasetComponent } from './mydataset/mydataset.component';
const routes: Routes = [
  {
    path: "datasets-list",
    component: DatasetsListComponent,
  },
  {
    path: "dataset-view/:id",
    component: DatasetViewComponent,
  },
  {
    path: "dataset-upload",
    component: DatasetUploadComponent,
  },
  {
    path: "my-datasets",
    component: MydatasetComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatasetsRoutingModule { }
