import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { IconComponent } from '../../icon/icon.component';
import { FormAddTag } from '../form-add-tag/form-add-tag';
import { ModalManageTagComponent } from '../modal-manage-tag/modal-manage-tag.component';

@Component({
  selector: 'app-tag-list-options',
  standalone: true,
  imports: [CommonModule, NzDropDownModule, IconComponent, FormAddTag, ModalManageTagComponent],
  templateUrl: './tag-list-options.component.html',
  styleUrls: ['./tag-list-options.component.scss']
})
export class TagListOptionsComponent {

}
