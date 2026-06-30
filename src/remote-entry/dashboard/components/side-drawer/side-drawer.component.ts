import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-side-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-drawer.component.html',
  styleUrl: './side-drawer.component.scss',
})
export class SideDrawerComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() width = '480px';
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as Element).classList.contains('drawer-backdrop')) {
      this.close();
    }
  }
}
