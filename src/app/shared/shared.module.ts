import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StashTabComponent } from './components/stash-tab/stash-tab.component';
import { SettingsDialogComponent } from './components/settings-dialog/settings-dialog.component';


@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    StashTabComponent,
    SettingsDialogComponent
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
    ReactiveFormsModule
  ],
  exports: [
    TranslateModule,
    WebviewDirective,
    FormsModule,
    SettingsDialogComponent,
    StashTabComponent,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
