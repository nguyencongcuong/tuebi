import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService implements OnInit{
  isXs = new BehaviorSubject(false);

  constructor(private responsive: BreakpointObserver) { }
  
  public ngOnInit() {
    // Match Medium and up
    this.responsive.observe(Breakpoints.HandsetPortrait)
      .subscribe(result => {
        return result.matches ? this.isXs.next(true) : this.isXs.next(false);
      });
  }
}
