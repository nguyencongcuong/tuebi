import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Observable, of } from 'rxjs';
import { Tag } from '../../../interfaces/tag.interface';
import { TagEntityService } from '../../../services/tag-entity.service';
import { IconComponent } from '../../icon/icon.component';
import { FormEditTag } from '../form-edit-tag/form-edit-tag';

@Component({
  selector: 'app-modal-manage-tag',
  standalone: true,
  imports: [CommonModule, IconComponent, NzModalModule, FormEditTag],
  templateUrl: './modal-manage-tag.component.html',
  styleUrls: ['./modal-manage-tag.component.scss']
})
export class ModalManageTagComponent implements OnInit {
  public isVisible = false;
  public tags$: Observable<Tag[]> = of([]);
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private tagEntityService: TagEntityService,
  ) {
    this.tags$ = this.tagEntityService.entities$;
  }
  
  public async ngOnInit() {
    this.tags$.subscribe(data => {
      console.log(data)
    })
  }
  
  closeModal() {
    this.isVisible = false;
  }
  
  openModal() {
    this.isVisible = true;
  }
}
