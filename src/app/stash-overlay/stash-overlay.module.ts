import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StashOverlayComponent } from './stash-overlay.component';
import { StashOverlayRoutingModule } from './stash-overlay-routing.module';
import { SharedModule } from '../shared/shared.module';
import {MatRadioModule} from '@angular/material/radio';



@NgModule({
  declarations: [StashOverlayComponent],
  imports: [
    CommonModule,
    StashOverlayRoutingModule,
    SharedModule,
    MatRadioModule
  ]
})
export class StashOverlayModule {

}
