import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { route } from '../../../enums/routes.enum';
import { AuthService } from '../../../services/auth.service';
import { LogoComponent } from '../../commons/logo/logo.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LogoComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public route = route;
  
  constructor(
    public authService: AuthService
  ) {}
}
