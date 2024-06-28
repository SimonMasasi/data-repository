
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() currentPage:any;
  @Input() totalPages: any;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  get totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  goToPage(pageNumber: number) {
    if (pageNumber !== this.currentPage) {
      this.pageChange.emit(pageNumber);
    }
  }
}
