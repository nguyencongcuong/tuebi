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
    this.responsive.observe(Breakpoints.HandsetPortrait)
      .subscribe(result => {
      
        if (result.matches) {
          this.isXs.next(true);
          console.log("screens matches HandsetLandscape");
        }
      
      });
  }
}
