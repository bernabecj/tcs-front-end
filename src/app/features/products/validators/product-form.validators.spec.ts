import { FormControl, FormGroup } from '@angular/forms';
import { dateReleaseMinToday, dateRevisionOneYearAfter } from './product-form.validators';

/** Local date as YYYY-MM-DD */
function localDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

describe('product-form validators', () => {
  describe('dateReleaseMinToday', () => {
    it('returns error when date is before today', () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      const control = new FormControl(localDateString(past));
      expect(dateReleaseMinToday()(control)).toEqual({ dateReleaseMinToday: true });
    });
  });

  describe('dateRevisionOneYearAfter', () => {
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
