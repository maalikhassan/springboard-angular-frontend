import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CompanyService} from './service/company/company-service';

@Component({
  selector: 'app-company',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './company.html',
  styleUrl: './company.css',
})
export class Company implements OnInit{
  companyForm: FormGroup;
  companies: any[] = [];
  currentPage = 1;
  pageSize = 5;
  constructor(
    private fb: FormBuilder,
    private service: CompanyService,
    private cdr:ChangeDetectorRef
  ) {
    this.companyForm = this.fb.group({
      id:[''],
      name: ['',Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['',Validators.required],
      city: ['',Validators.required],
      country: ['',Validators.required],
      website: ['', [Validators.required, Validators.pattern('https?://.*')]],
      phone: ['',Validators.required],
      description: ['',Validators.required],
    });
  }
  get totalPages(): number {
    return Math.ceil((this.companies?.length ?? 0) / this.pageSize);
  }

  get pagedCompany(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return (this.companies ?? []).slice(start, start + this.pageSize);
  }

  get pageStartIndex(): number {
    if (!this.companies?.length) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get pageEndIndex(): number {
    if (!this.companies?.length) return 0;
    return Math.min(this.currentPage * this.pageSize, this.companies.length);
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



  getCompany() {
    this.service.getAllCompany().subscribe({
      next: (response) => {
        // @ts-ignore
        this.companies = response ?? [];
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
    if (this.companyForm.valid) {
      const payload = this.companyForm.getRawValue();
      this.service.addCompany(payload).subscribe(
        () => {
          this.getCompany();
          this.cdr.detectChanges();
          this.clearForm();
        },
        () => {
          alert('Failed to save company!');
        }
      );
    }
  }
  clearForm() {
    this.companyForm.reset();
  }
  editCompany(id: number){
    this.service.editCompanyById(id).subscribe(
      (company:any) => {
        this.companyForm.patchValue(company);
      },
      () => {
        alert('Failed to save company!');
      }
    )
  }
  deleteCompany(id: number) {
    this.service.deleteCompanyById(id).subscribe(
      () => {
        this.getCompany();
      },
      () => {
        alert('Failed to delete company!');
      }
    )
  }
  updateCompany() {
    this.service.updateCompany(this.companyForm.getRawValue()).subscribe(
      () => {
        this.getCompany();
        this.cdr.detectChanges();
        this.clearForm();
      },
      () => {
        alert('Failed to update customer!');
      }
    )
  }
  ngOnInit() {
    this.getCompany();
  }
}
