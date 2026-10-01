import { Component, ViewEncapsulation } from '@angular/core';
import { AuthPanelComponent } from './features/auth/auth-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AuthPanelComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
}
