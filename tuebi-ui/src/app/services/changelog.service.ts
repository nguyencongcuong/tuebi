import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChangelogService {
  private API_URL = environment.backend_url;
  
  constructor(
    private http : HttpClient
  ) { }
  
  read() {
    return this.http.get(this.API_URL + '/changelog').pipe(map((res: any) => res.success ? res.data : []));
  }
}
