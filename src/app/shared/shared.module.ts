import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StashTabComponent } from './components/stash-tab/stash-tab.component';
import { SettingsDialogComponent } from './components/settings-dialog/settings-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ErrorDetailDialogComponent } from './components/error-detail-dialog/error-detail-dialog.component';



@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    StashTabComponent,
    SettingsDialogComponent,
    ErrorDetailDialogComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatTooltipModule
  ],
  exports: [
    TranslateModule,
    WebviewDirective,
    FormsModule,
    SettingsDialogComponent,
    StashTabComponent,
    ReactiveFormsModule,
    ErrorDetailDialogComponent,
    MatTooltipModule
  ]
})
export class SharedModule { }
