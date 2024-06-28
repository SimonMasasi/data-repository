import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelListComponent } from './model-list/model-list.component';
import { ModelUploadComponent } from './model-upload/model-upload.component';
import { ModelViewComponent } from './model-list/model-view/model-view.component';
const routes: Routes = [
  {
    path:"models-list",
    component: ModelListComponent,
  },  
  {
    path:"model-upload",
    component: ModelUploadComponent,
  },
  {
    path: "model-view/:id",
    component: ModelViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelsRoutingModule { }
