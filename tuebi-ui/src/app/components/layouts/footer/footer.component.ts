import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { route } from '../../../enums/routes.enum';
import { AuthService } from '../../../services/auth.service';
import { LogoComponent } from '../../commons/logo/logo.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LogoComponent, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public route = route;
  
  constructor(
    public authService: AuthService
  ) {
  }
  
}
