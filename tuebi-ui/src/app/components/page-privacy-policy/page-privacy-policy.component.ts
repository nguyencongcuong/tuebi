import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../layouts/footer/footer.component';
import { HeaderComponent } from '../layouts/header/header.component';

@Component({
  selector: 'app-page-privacy-policy',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './page-privacy-policy.component.html',
  styleUrls: ['./page-privacy-policy.component.scss']
})
export class PagePrivacyPolicyComponent implements OnInit {
  constructor() {}
  
  public ngOnInit() {}
}
