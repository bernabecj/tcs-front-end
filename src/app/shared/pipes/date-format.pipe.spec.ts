import { DateFormatPipe } from './date-format.pipe';

describe('DateFormatPipe', () => {
  const pipe = new DateFormatPipe();

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format date to dd/MM/yyyy', () => {
    expect(pipe.transform('2025-01-01')).toBe('01/01/2025');
    expect(pipe.transform('2000-12-31')).toBe('31/12/2000');
  });
});
