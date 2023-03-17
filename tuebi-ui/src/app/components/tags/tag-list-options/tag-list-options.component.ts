import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { IconComponent } from '../../icon/icon.component';
import { ModalManageTagComponent } from '../modal-manage-tag/modal-manage-tag.component';

@Component({
  selector: 'app-tag-list-options',
  standalone: true,
  imports: [CommonModule, NzDropDownModule, IconComponent, ModalManageTagComponent],
  templateUrl: './tag-list-options.component.html',
  styleUrls: ['./tag-list-options.component.scss']
})
export class TagListOptionsComponent {

}
