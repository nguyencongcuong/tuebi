import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { COLOR_MAPPING } from '../../../enums/color-mapping.enum';
import { Tag } from '../../../interfaces/tag.interface';
import { TagEntityService } from '../../../services/tag-entity.service';
import {
  TypographySectionHeaderComponent
} from '../../commons/typography-section-header/typography-section-header.component';
import { IconComponent } from '../../icon/icon.component';
import { FormAddTag } from '../form-add-tag/form-add-tag';
import { TagListOptionsComponent } from '../tag-list-options/tag-list-options.component';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TagListOptionsComponent, FormAddTag, TypographySectionHeaderComponent, IconComponent, TagComponent],
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent {
  tags$ : Observable<Tag[]> = of([]);
  colorMapping = COLOR_MAPPING;
  
  constructor(
    private tagEntityService: TagEntityService
  ) {
    this.tags$ = this.tagEntityService.entities$;
  }
}
