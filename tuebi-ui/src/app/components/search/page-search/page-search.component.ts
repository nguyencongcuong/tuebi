import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Fuse from 'fuse.js';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { debounceTime, firstValueFrom, Observable, of } from 'rxjs';
import { Bookmark } from '../../../interfaces/bookmark.interface';
import { BookmarkEntityService } from '../../../services/bookmark-entity.service';
import { BookmarkComponent } from '../../bookmarks/bookmark/bookmark.component';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-page-search',
  standalone: true,
  imports: [
    CommonModule, 
    NzInputModule, 
    FormsModule, 
    BookmarkComponent, 
    ReactiveFormsModule, 
    NzIconModule, 
    IconComponent
  ],
  templateUrl: './page-search.component.html',
  styleUrls: ['./page-search.component.scss']
})
export class PageSearchComponent implements OnInit {
  public bookmarks$: Observable<Bookmark[]> = of([]);
  public bookmarks: Bookmark[] = [];
  public searchedBookmarks: Bookmark[] = [];
  public form: FormGroup
  public isSearching : boolean = false;
  
  constructor(
    private bookmarkEntityService: BookmarkEntityService,
    private fb: FormBuilder
  ) {
    this.bookmarks$ = this.bookmarkEntityService.getAll();
    this.form = this.fb.group({
      keywords: ['', Validators.required]
    })
  }
  
  get keywords() {
    return this.form.controls['keywords'].value;
  }
  
  public async ngOnInit() {
    this.bookmarks = await firstValueFrom(this.bookmarks$);
    this.form.valueChanges.pipe(debounceTime(500)).subscribe(form => {
      if (form.keywords) {
        this.isSearching = true;
        const fuse = new Fuse(this.bookmarks, {
          keys: ['bookmark_name', 'bookmark_url'],
          shouldSort: true,
          isCaseSensitive: false,
          threshold: 0.3
        })
        this.searchedBookmarks = fuse.search(form.keywords).map((searched => searched.item));
      } else {
        this.isSearching = false;
        this.searchedBookmarks = [];
      }
    })
  }
}
