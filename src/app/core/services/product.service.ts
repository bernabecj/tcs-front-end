import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/bp/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<{ data: Product[] }> {
    return this.http.get<{ data: Product[] }>(this.apiUrl);
  }

  getProductById(id: string): Observable<Product> {
    return this.http
      .get<{ data: Product[] }>(this.apiUrl)
      .pipe(
        map((res) => {
          const product = res.data?.find((p) => p.id === id);
          if (!product) {
            throw new Error('Product not found');
          }
          return product;
        })
      );
  }

  verifyProductId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`);
  }

  createProduct(product: Omit<Product, 'id'> & { id: string }): Observable<{ data: Product }> {
    return this.http.post<{ data: Product }>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Partial<Omit<Product, 'id'>>): Observable<{ data: Product }> {
    return this.http.put<{ data: Product }>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
