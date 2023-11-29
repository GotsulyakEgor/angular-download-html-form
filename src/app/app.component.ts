import {Component} from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  imageForm: FormGroup;
  imageUrl: string;
  animationClass: string;

  constructor(private fb: FormBuilder) {
    this.imageForm = this.fb.group({
      image: ['', Validators.required],
      animation: ['', Validators.required],
      imageSize: [''],
      containerWidth: [''],
      containerHeight: [''],
      imagePositionX: [''],
      imagePositionY: ['']
    })
  }

  downloadHtmlFile() {
    const htmlCode = this.generateHtmlCode();
    const blob = new Blob([htmlCode], {type: 'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'output.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private generateHtmlCode(): string {
    const imageSize = this.imageForm.value.imageSize ? `width="${this.imageForm.value.imageSize}"` : '';
    const containerStyle = this.getContainerStyle();
    const animationStyle = this.getAnimationStyle();
    return `
    <style>
      ${animationStyle}
    </style>
    <div style="${containerStyle}">
      <img src="assets/${this.imageForm.value.image.split('\\').pop()}" style="${imageSize}" class="animated-image"/>
    </div>
  `;
  }

  private getAnimationStyle(): string {
    if (this.animationClass === 'slideInFromTop') {
      return `
      @keyframes slideInFromTop {
        from {
          transform: translateY(-100%);
        }
        to {
          transform: translateY(0);
        }
      }
      .animated-image {
        animation: slideInFromTop 1s ease-in-out;
      }
    `;
    } else if (this.animationClass === 'zoomInFromBottom') {
      return `
      @keyframes zoomInFromBottom {
        from {
          transform: scale(0);
        }
        to {
          transform: scale(1);
        }
      }
      .animated-image {
        animation: zoomInFromBottom 1s ease-in-out;
      }
    `;
    }
    return '';
  }

  private getContainerStyle(): string {
    const width = this.getStylePropertyValue('containerWidth');
    const height = this.getStylePropertyValue('containerHeight');
    const positionX = this.getStylePropertyValue('imagePositionX', 'left');
    const positionY = this.getStylePropertyValue('imagePositionY', 'top');
    return `${width} ${height} position: relative; overflow: hidden; ${positionX} ${positionY}`;
  }

  private getStylePropertyValue(controlName: string, styleProperty: string = controlName.toLowerCase()): string {
    return this.imageForm.value[controlName] ? `${styleProperty}: ${this.imageForm.value[controlName]}px;` : '';
  }

  resetForm() {
    this.imageForm.reset();
    this.imageForm.markAsPristine();
    this.imageForm.markAsUntouched();
    this.imageUrl = ''
  }

  public onSubmit() {
    if (this.imageForm.valid) {
      this.imageUrl = this.imageForm.value.image.split('\\').pop();
      this.animationClass = this.imageForm.value.animation;
    } else {
      alert("Form is not valid");
    }
  }

}
