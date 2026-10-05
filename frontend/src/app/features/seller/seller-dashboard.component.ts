import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductInput } from '../../core/models/product.model';
import { ProductService } from '../../core/api/product.service';
import { MediaService } from '../../core/api/media.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css']
})
export class SellerDashboardComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly mediaService   = inject(MediaService);
  private readonly route          = inject(ActivatedRoute);
  private readonly router         = inject(Router);

  draft: ProductInput = this.emptyDraft();
  editingId = '';
  error = '';
  successMessage = '';

  // Image upload state
  selectedFiles: File[] = [];
  previews: string[] = [];
  uploadedUrls: string[] = [];
  uploadingImages = false;
  saving = false;

  get isEditing(): boolean { return this.editingId.length > 0; }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editingId = id;
        this.loadProduct(id);
      } else {
        this.editingId = '';
        this.draft = this.emptyDraft();
        this.resetImages();
      }
    });
  }

  loadProduct(id: string): void {
    this.productService.get(id).subscribe({
      next: (product) => {
        this.draft = {
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          imageUrls: product.imageUrls ? [...product.imageUrls] : []
        };
        // Pre-fill already-saved image URLs so they are preserved if no new images are selected
        this.uploadedUrls = product.imageUrls ? [...product.imageUrls] : [];
        // Show existing images as previews
        this.previews = this.uploadedUrls.map(u => u);
      },
      error: () => this.error = 'Could not load product for editing.'
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) { return; }

    const incoming = Array.from(input.files);
    // previews.length counts ALL staged images (already-uploaded + newly selected)
    const total = this.previews.length + incoming.length;
    if (total > 5) {
      this.error = `You can upload at most 5 images in total (${this.previews.length} already staged).`;
      input.value = '';
      return;
    }

    incoming.forEach(file => {
      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previews.push(e.target!.result as string);
      };
      reader.readAsDataURL(file);
    });

    this.error = '';
  }

  removeFile(index: number): void {
    if (index < this.uploadedUrls.length) {
      // Removing an already-uploaded image (comes first in previews)
      this.uploadedUrls.splice(index, 1);
    } else {
      // Removing a newly selected (not yet uploaded) file
      const fileIndex = index - this.uploadedUrls.length;
      this.selectedFiles.splice(fileIndex, 1);
    }
    this.previews.splice(index, 1);
  }

  save(): void {
    if (!this.draftIsValid()) {
      this.error = 'Please fill in all required fields with valid values.';
      return;
    }

    this.clearMessages();

    // Step 1 – if new files are staged, upload them and wait for the URLs
    // before proceeding to Step 2 (submit product to product service).
    if (this.selectedFiles.length > 0) {
      this.uploadingImages = true;
      this.saving = true;
      this.mediaService.uploadImages(this.selectedFiles).subscribe({
        next: (urls: string[]) => {
          // Merge returned URLs with any previously-uploaded ones
          this.uploadedUrls = [...this.uploadedUrls, ...urls];
          this.selectedFiles = [];
          this.uploadingImages = false;
          // Step 2 – now send the product payload with the final URLs
          this.submitProduct();
        },
        error: (err) => {
          this.uploadingImages = false;
          this.saving = false;
          this.error = err.error?.message || 'Image upload failed. Please try again.';
        }
      });
    } else {
      // No new images — go straight to Step 2
      this.saving = true;
      this.submitProduct();
    }
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }

  private submitProduct(): void {
    const payload: ProductInput = {
      ...this.draft,
      imageUrls: this.uploadedUrls.length > 0 ? this.uploadedUrls : undefined
    };

    const request = this.isEditing
      ? this.productService.update(this.editingId, payload)
      : this.productService.create(payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = this.isEditing
          ? 'Product updated successfully!'
          : 'Product published successfully!';

        if (this.isEditing) {
          // Stay on the edit page and reload the fresh product data
          this.loadProduct(this.editingId);
        } else {
          // Stay on the create page and reset the form for a new listing
          this.draft = this.emptyDraft();
          this.resetImages();
        }

        setTimeout(() => { this.successMessage = ''; }, 3000);
        // No navigation — the user stays on this page after submission
      },
      error: (err) => {
        this.saving = false;
        this.error = err.error?.message || 'Could not save product.';
      }
    });
  }

  private resetImages(): void {
    this.selectedFiles = [];
    this.previews = [];
    this.uploadedUrls = [];
  }

  private emptyDraft(): ProductInput {
    return { name: '', description: '', price: 0, quantity: 0, imageUrls: [] };
  }

  private draftIsValid(): boolean {
    return this.draft.name.trim().length > 0
      && this.draft.description.trim().length > 0
      && this.draft.price > 0
      && this.draft.quantity >= 0;
  }

  private clearMessages(): void {
    this.error = '';
    this.successMessage = '';
  }
}
