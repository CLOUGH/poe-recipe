import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { HomeRoutingModule } from './home/home-routing.module';
import { StashOverlayModule } from './stash-overlay/stash-overlay.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'stash-overlay',
    loadChildren: () => StashOverlayModule
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', useHash: true  }),
    HomeRoutingModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
