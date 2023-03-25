import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../layouts/footer/footer.component';
import { HeaderComponent } from '../layouts/header/header.component';

@Component({
  selector: 'app-page-terms-of-service',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './page-terms-of-service.component.html',
  styleUrls: ['./page-terms-of-service.component.scss']
})
export class PageTermsOfServiceComponent {

}
