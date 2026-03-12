import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Returns today's date in local time as YYYY-MM-DD */
function getTodayLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function dateReleaseMinToday(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string | null;
    if (!value) return null;
    const today = getTodayLocal();
    return value < today ? { dateReleaseMinToday: true } : null;
  };
}

export function dateRevisionOneYearAfter(releaseControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const revision = control.value as string | null;
    const release = control.root.get(releaseControlName)?.value as string | null;
    if (!revision || !release) return null;
    const match = String(release).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return null;
    const expected = `${Number(match[1]) + 1}-${match[2]}-${match[3]}`;
    return revision !== expected ? { dateRevisionOneYear: true } : null;
  };
}
