import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Tag } from '../../../interfaces/tag.interface';
import { TagEntityService } from '../../../services/tag-entity.service';
import {
  TypographySectionHeaderComponent
} from '../../commons/typography-section-header/typography-section-header.component';
import { IconComponent } from '../../icon/icon.component';
import { AddTag } from '../add-tag/add-tag';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TypographySectionHeaderComponent, IconComponent, TagComponent, AddTag],
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent {
  tags$ : Observable<Tag[]> = of([]);
  
  constructor(
    private tagEntityService: TagEntityService
  ) {
    this.tags$ = this.tagEntityService.entities$;
  }
}
