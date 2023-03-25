import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import Fuse from 'fuse.js';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { debounceTime, firstValueFrom, Observable, of } from 'rxjs';
import { Bookmark } from '../../../interfaces/bookmark.interface';
import { BookmarkEntityService } from '../../../services/bookmark-entity.service';
import { BookmarkComponent } from '../../bookmarks/bookmark/bookmark.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    NzInputModule,
    FormsModule,
    BookmarkComponent,
    ReactiveFormsModule,
    NzIconModule,
    IconComponent,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
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
    this.form.valueChanges.pipe(debounceTime(300)).subscribe(form => {
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
  
  public async cancelSearch() {
    this.form.reset()
  }
}
