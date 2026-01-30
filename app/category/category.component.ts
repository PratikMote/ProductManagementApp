import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../services/category.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  category = { name: '' };
  editingId: number | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe((res) => {
      this.categories = res;
    });
  }

  save(): void {
    if (!this.category.name.trim()) return;

    if (this.editingId !== null) {
      this.categoryService
        .update(this.editingId, this.category)
        .subscribe(() => {
          this.reset();
          this.loadCategories();
        });
    } else {
      this.categoryService.create(this.category).subscribe(() => {
        this.reset();
        this.loadCategories();
      });
    }
  }

  edit(cat: Category): void {
    this.editingId = cat.id;
    this.category = { name: cat.name };
  }

  delete(id: number): void {
    this.categoryService.delete(id).subscribe(() => this.loadCategories());
  }

  reset(): void {
    this.category = { name: '' };
    this.editingId = null;
  }
}
