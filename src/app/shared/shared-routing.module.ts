import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    declarations: [

    ],
    exports: [RouterModule]
})
export class SharedRoutingModule { }
