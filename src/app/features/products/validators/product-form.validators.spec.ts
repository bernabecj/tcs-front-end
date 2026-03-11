import { FormControl, FormGroup } from '@angular/forms';
import { dateReleaseMinToday, dateRevisionOneYearAfter } from './product-form.validators';

/** Local date as YYYY-MM-DD (matches validator logic). */
function localDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

describe('product-form validators', () => {
  describe('dateReleaseMinToday', () => {
    it('returns null when value is empty', () => {
      const control = new FormControl('');
      expect(dateReleaseMinToday()(control)).toBeNull();
    });

    it('returns error when date is before today', () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      const control = new FormControl(localDateString(past));
      expect(dateReleaseMinToday()(control)).toEqual({ dateReleaseMinToday: true });
    });

    it('returns null when date is today', () => {
      const today = localDateString(new Date());
      const control = new FormControl(today);
      expect(dateReleaseMinToday()(control)).toBeNull();
    });

    it('returns null when date is after today', () => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      const control = new FormControl(localDateString(future));
      expect(dateReleaseMinToday()(control)).toBeNull();
    });
  });

  describe('dateRevisionOneYearAfter', () => {
    it('returns null when revision or release is empty', () => {
      const group = new FormGroup({
        date_release: new FormControl(null),
        date_revision: new FormControl('2026-01-01'),
      });
      const control = group.get('date_revision')!;
      expect(dateRevisionOneYearAfter('date_release')(control)).toBeNull();
    });

    it('returns error when revision is not one year after release', () => {
      const group = new FormGroup({
        date_release: new FormControl('2025-01-15'),
        date_revision: new FormControl('2026-01-14'),
      });
      const control = group.get('date_revision')!;
      expect(dateRevisionOneYearAfter('date_release')(control)).toEqual({ dateRevisionOneYear: true });
    });

    it('returns null when revision is exactly one year after release', () => {
      const group = new FormGroup({
        date_release: new FormControl('2025-01-15'),
        date_revision: new FormControl('2026-01-15'),
      });
      const control = group.get('date_revision')!;
      expect(dateRevisionOneYearAfter('date_release')(control)).toBeNull();
    });
  });
});
