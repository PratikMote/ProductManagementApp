import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  productId: number;
  productName: string;
  categoryId: number;
  categoryName: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getPaged(page: number, pageSize: number): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.baseUrl}?page=${page}&pageSize=${pageSize}`,
    );
  }

  create(product: {
    name: string;
    categoryId: number | null;
  }): Observable<void> {
    return this.http.post<void>(this.baseUrl, product);
  }

  update(
    id: number,
    product: { name: string; categoryId: number | null },
  ): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
