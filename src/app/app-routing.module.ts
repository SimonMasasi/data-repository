import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandigPageComponent } from './shared/component/landig-page/landig-page.component';
import { LoginComponent } from './guest/login/login.component';
import { RegisterComponent } from './guest/register/register.component';
import { VerificationComponent } from './guest/verification/verification.component';
import { FullLayoutComponent } from './shared/component/layout/admin-layout/full-layout/full-layout.component';

const routes: Routes = [
  {
    path:"",
    component: LandigPageComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "verification",
    component: VerificationComponent,
  },
  {
    path: "datasets",
    loadChildren: () =>
    import('./modules/datasets/datasets.module').then((m) => m.DatasetsModule)
  },
  {
    path: "dashboard",
    component: FullLayoutComponent,
    loadChildren: () =>
    import('./modules/datasets/datasets.module').then((m) => m.DatasetsModule)
  },
  {
    path: "dashboard",
    component: FullLayoutComponent,
    loadChildren: () =>
    import('./modules/user/user.module').then((m) => m.UserModule)
  },
  {
    path: "dashboard",
    component: FullLayoutComponent,
    loadChildren: () =>
    import('./modules/models/models.module').then((m) => m.ModelsModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
