import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { StashOverlayComponent } from './stash-overlay.component';

const routes: Routes = [
    {
        path: '',
        component: StashOverlayComponent
    }
];


@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StashOverlayRoutingModule { }