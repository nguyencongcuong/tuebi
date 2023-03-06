import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  @Input() name = '';
  
  mappedIconName = '';
  mappedIcons = [
    {
      icon_name: 'bookmark',
      mapped_icon_name: 'bookmark'
    },
    {
      icon_name: 'settings',
      mapped_icon_name: 'settings'
    },
    {
      icon_name: 'user',
      mapped_icon_name: 'person'
    },
    {
      icon_name: 'slider',
      mapped_icon_name: 'tune'
    },
    {
      icon_name: 'export',
      mapped_icon_name: 'ios_share'
    },
    {
      icon_name: 'info',
      mapped_icon_name: 'info'
    },
    {
      icon_name: 'more_horiz',
      mapped_icon_name: 'more_horiz'
    },
    {
      icon_name: 'more_vert',
      mapped_icon_name: 'more_vert'
    },
    {
      icon_name: 'login',
      mapped_icon_name: 'login'
    },
    {
      icon_name: 'logout',
      mapped_icon_name: 'logout'
    },
    {
      icon_name: 'shield',
      mapped_icon_name: 'shield'
    },
    {
      icon_name: 'colorize',
      mapped_icon_name: 'colorize'
    },
    {
      icon_name: 'logout',
      mapped_icon_name: 'logout'
    },
    {
      icon_name: 'search',
      mapped_icon_name: 'search'
    },
    {
      icon_name: 'rocket_launch',
      mapped_icon_name: 'rocket_launch'
    },
    {
      icon_name: 'lock_open',
      mapped_icon_name: 'lock_open'
    },
    {
      icon_name: 'lock',
      mapped_icon_name: 'lock'
    },
    {
      icon_name: 'menu',
      mapped_icon_name: 'menu'
    },
    {
      icon_name: 'public',
      mapped_icon_name: 'public'
    },
    {
      icon_name: 'admin_panel_settings',
      mapped_icon_name: 'admin_panel_settings'
    },
    {
      icon_name: 'add',
      mapped_icon_name: 'add'
    },
    {
      icon_name: 'collections_bookmark',
      mapped_icon_name: 'collections_bookmark'
    },
    {
      icon_name: 'folder',
      mapped_icon_name: 'folder'
    },
    {
      icon_name: 'folder_off',
      mapped_icon_name: 'folder_off'
    },
    {
      icon_name: 'delete',
      mapped_icon_name: 'delete'
    },
    {
      icon_name: 'restore_from_trash',
      mapped_icon_name: 'return_from_trash'
    },
    {
      icon_name: 'edit',
      mapped_icon_name: 'edit'
    },
    {
      icon_name: 'content_copy',
      mapped_icon_name: 'content_copy'
    },
    {
      icon_name: 'link',
      mapped_icon_name: 'link'
    },
    {
      icon_name: 'history',
      mapped_icon_name: 'history'
    },
    {
      icon_name: 'navigate_next',
      mapped_icon_name: 'navigate_next'
    },
    {
      icon_name: 'home',
      mapped_icon_name: 'home'
    },
    {
      icon_name: 'tag',
      mapped_icon_name: 'tag'
    },
    {
      icon_name: 'palette',
      mapped_icon_name: 'palette'
    },
    {
      icon_name: 'arrow_upward',
      mapped_icon_name: 'arrow_upward'
    },
    {
      icon_name: 'arrow_downward',
      mapped_icon_name: 'arrow_downward'
    }
  ]
  
  public ngOnInit() {
    const foundIcon = this.mappedIcons.find(item => item.icon_name === this.name);
    this.mappedIconName = foundIcon?.mapped_icon_name || '';
  }
}
