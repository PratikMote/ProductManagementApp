import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../services/product.service';
import { CategoryService, Category } from '../services/category.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  product = { name: '', categoryId: null as number | null };
  editingId: number | null = null;
  page = 1;
  pageSize = 10;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe((res) => {
      this.categories = res;
    });
  }

  loadProducts(): void {
    this.productService.getPaged(this.page, this.pageSize).subscribe((res) => {
      this.products = res;
    });
  }

  save(): void {
    if (!this.product.name || this.product.categoryId === null) return;

    if (this.editingId !== null) {
      this.productService.update(this.editingId, this.product).subscribe(() => {
        this.reset();
        this.loadProducts();
      });
    } else {
      this.productService.create(this.product).subscribe(() => {
        this.reset();
        this.loadProducts();
      });
    }
  }

  edit(p: Product): void {
    this.editingId = p.productId;
    this.product = { name: p.productName, categoryId: p.categoryId };
  }

  delete(id: number): void {
    this.productService.delete(id).subscribe(() => this.loadProducts());
  }

  next(): void {
    this.page++;
    this.loadProducts();
  }

  prev(): void {
    if (this.page > 1) {
      this.page--;
      this.loadProducts();
    }
  }

  reset(): void {
    this.product = { name: '', categoryId: null };
    this.editingId = null;
  }
}
