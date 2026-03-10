/**
 * Financial product model matching the backend API structure.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}
