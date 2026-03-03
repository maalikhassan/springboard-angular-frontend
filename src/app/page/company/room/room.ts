import {ChangeDetectorRef, Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RoomService} from '../service/room/room-service';
import {NgForOf, NgIf} from '@angular/common';
import {CompanyService} from '../service/company/company-service';
import {PackageService} from '../service/package/package-service';

@Component({
  selector: 'app-room',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './room.html',
  styleUrl: './room.css',
})
export class RoomComponent {

  isEditMode = false;
  packages :any[] =[];
  companies:any[] =[];
  roomForm: FormGroup;
  rooms: any[] = [];
  currentPage = 1;
  pageSize = 5;
  constructor(
    private fb: FormBuilder,
    private service: RoomService,
    private companyService:CompanyService,
    private packageService: PackageService,
    private cdr:ChangeDetectorRef
  ) {
    this.roomForm = this.fb.group({
      id:[''],
      name: ['',Validators.required],
      company_id: ['', [Validators.required]],
      capacity: ['',Validators.required],
      type: ['',Validators.required],
      isBooked: [false],
      isAvailable: [true],
      package_id: ['', [Validators.required]],
    });
  }
  get totalPages(): number {
    return Math.ceil((this.rooms?.length ?? 0) / this.pageSize);
  }

  get pagedRoom(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return (this.rooms ?? []).slice(start, start + this.pageSize);
  }

  get pageStartIndex(): number {
    if (!this.rooms?.length) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get pageEndIndex(): number {
    if (!this.rooms?.length) return 0;
    return Math.min(this.currentPage * this.pageSize, this.rooms.length);
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
    this.companyService.getAllCompany().subscribe({
      next: (response) => {
        // @ts-ignore
        this.companies = response ?? [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error:", error);
      }
    });
  }
  getPackage() {
    this.packageService.getAllPackage().subscribe({
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

  getRoom() {
    this.service.getAllRoom().subscribe({
      next: (response) => {
        // @ts-ignore
        this.rooms = response ?? [];
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
    if (this.roomForm.valid) {
      const payload = this.roomForm.getRawValue();
      this.service.addRoom(payload).subscribe(
        () => {
          this.getRoom();
          this.cdr.detectChanges();
          this.clearForm();
        },
        () => {
          alert('Failed to save room!');
        }
      );
    }
  }
  clearForm() {
    this.roomForm.reset();
    this.roomForm.patchValue({
      isBooked: false,
      isAvailable: true,
      company_id:"Choose a Company",
      type:"Choose a Room Type",
      package_id:"Choose a Package"
    });
    this.isEditMode = false;
  }
  editRoom(id: number){
    this.service.editRoomById(id).subscribe(
      (room:any) => {
        this.roomForm.patchValue(room);
        this.roomForm.get('isBooked')?.enable();
        this.roomForm.get('isAvailable')?.enable();
        this.isEditMode = true;
      },
      () => {
        alert('Failed to save room!');
      }
    )
  }
  deleteRoom(id: number) {
    this.service.deleteRoomById(id).subscribe(
      () => {
        this.getRoom();
        this.roomForm.get('isBooked')?.disable();
        this.roomForm.get('isAvailable')?.disable();
        this.roomForm.patchValue({
          isBooked: false,
          isAvailable: true,
          company_id:"Choose a Company",
          type:"Choose a Room Type",
          package_id:"Choose a Package"
        });

      },
      () => {
        alert('Failed to delete room!');
      }
    )
  }
  updateRoom() {
    this.service.updateRoom(this.roomForm.getRawValue()).subscribe(
      () => {
        this.getRoom();
        this.cdr.detectChanges();
        this.clearForm();
      },
      () => {
        alert('Failed to update customer!');
      }
    )
  }
  ngOnInit() {
    this.getRoom();
    this.getCompany();
    this.getPackage();

    this.roomForm.get('isBooked')?.disable();
    this.roomForm.get('isAvailable')?.disable();
    this.roomForm.get('package_id')?.setValue("Choose a Package");
    this.roomForm.get('company_id')?.setValue("Choose a Company");
    this.roomForm.get('type')?.setValue("Choose a Room Type");

  }
}
