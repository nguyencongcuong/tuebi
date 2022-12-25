import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { Observable, of } from 'rxjs';
import { ChangeLog } from 'src/app/interfaces/changelog.interface';
import { ChangelogService } from 'src/app/services/changelog.service';

@Component({
  selector: 'app-changelog',
  standalone: true,
  imports: [CommonModule, NzTimelineModule],
  providers: [ChangelogService],
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.scss']
})
export class ChangelogComponent implements OnInit {
  changelog$: Observable<ChangeLog[]> = of([]);
  
  constructor(
    private changelogService: ChangelogService,
  ) { }
  
  public ngOnInit() {
    this.changelog$ = this.changelogService.read();
  }
  
}
