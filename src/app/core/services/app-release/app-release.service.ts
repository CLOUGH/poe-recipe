import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ElectronService } from '../electron/electron.service';
import { SettingsService } from '../settings.service';

@Injectable({
  providedIn: 'root'
})
export class AppReleaseService {
  githubApi = 'https://api.github.com'

  constructor(private httpClient: HttpClient, private electronService: ElectronService, private settingService: SettingsService) {}
  
  getReleases() {
    const url = `${this.githubApi}/repos/CLOUGH/poe-recipe/releases`;
    return this.httpClient.get<any[]>(url);
  }

  getIsOutdated(): Observable<boolean> {
    const appVersion = this.electronService.remote.app.getVersion();

    return this.getReleases().pipe(
      map(releases => {
        if(releases.length >0 && releases[0].tag_name!==appVersion) {
          return true;
        }

        return false;
      })
    );
  }
}
