import {ChangeDetectorRef, Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {PackageService} from '../../service/package/package-service';
;

@Component({
  selector: 'app-package',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './package.html',
  styleUrl: './package.css',
})
export class Package {

  isEditMode = false;
  packages :any[] =[];
  currentPage = 1;
  pageSize = 5;
  packageForm:FormGroup;
  constructor(
    private fb: FormBuilder,
    private service: PackageService,
    private cdr:ChangeDetectorRef
  ) {
    this.packageForm = this.fb.group({
      id:[''],
      type: ['',Validators.required],
      price: ['',Validators.required],
      description: ['', [Validators.required]],
    });
  }
  get totalPages(): number {
    return Math.ceil((this.packages?.length ?? 0) / this.pageSize);
  }

  get pagedPackage(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return (this.packages ?? []).slice(start, start + this.pageSize);
  }

  get pageStartIndex(): number {
    if (!this.packages?.length) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get pageEndIndex(): number {
    if (!this.packages?.length) return 0;
    return Math.min(this.currentPage * this.pageSize, this.packages.length);
  }

  prevPage() {
    this.currentPage = Math.max(1, this.currentPage - 1);
  }

  nextPage() {
    this.currentPage = Math.min(this.totalPages, this.currentPage + 1);
  }

  goToPage(page: number) {
    const p = Math.max(1, Math.min(this.totalPages || 1, page));
    this.currentPage = p;
  }

  onPageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement | null;
    const nextSize = Number(target?.value);

    this.pageSize = Number.isFinite(nextSize) && nextSize > 0 ? nextSize : 5;
    this.currentPage = 1;
  }

  getPackage() {
    this.service.getAllPackage().subscribe({
      next: (response) => {
        // @ts-ignore
        this.packages = response ?? [];
        this.cdr.detectChanges();
        // Keep currentPage valid after refresh
        if (this.currentPage > this.totalPages) this.currentPage = this.totalPages || 1;
      },
      error: (error) => {
        console.error("Error:", error);
      }
    });
  }

  onSubmit() {
    if (this.packageForm.valid) {
      const payload = this.packageForm.getRawValue();
      this.service.addPackage(payload).subscribe(
        () => {
          this.getPackage();
          this.cdr.detectChanges();
          this.clearForm();
        },
        () => {
          alert('Failed to save Package!');
        }
      );
    }
  }
  clearForm() {
    this.packageForm.reset();
    this.isEditMode = false;
  }
  editPackage(id: number){
    this.service.editPackageById(id).subscribe(
      (Package:any) => {
        this.packageForm.patchValue(Package);
        this.isEditMode = true;
      },
      () => {
        alert('Failed to save Package!');
      }
    )
  }
  deletePackage(id: number) {
    this.service.deletePackageById(id).subscribe(
      () => {
        this.getPackage();
      },
      () => {
        alert('Failed to delete Package!');
      }
    )
  }
  updatePackage() {
    this.service.updatePackage(this.packageForm.getRawValue()).subscribe(
      () => {
        this.getPackage();
        this.cdr.detectChanges();
        this.clearForm();
      },
      () => {
        alert('Failed to update customer!');
      }
    )
  }
  ngOnInit() {
    this.getPackage();
  }
}
