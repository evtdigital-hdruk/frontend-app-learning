import { getConfig } from '@edx/frontend-platform';

import { buyUrl, requiresPurchase } from './purchase';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

describe('requiresPurchase', () => {
  it('is false when the modes are unknown or empty', () => {
    expect(requiresPurchase(undefined)).toBe(false);
    expect(requiresPurchase([])).toBe(false);
  });

  it('is false when any free mode exists', () => {
    expect(requiresPurchase([{ slug: 'audit' }, { slug: 'verified' }])).toBe(false);
    expect(requiresPurchase([{ slug: 'honor' }])).toBe(false);
  });

  it('is true when every mode is paid', () => {
    expect(requiresPurchase([{ slug: 'verified' }])).toBe(true);
    expect(requiresPurchase([{ slug: 'verified' }, { slug: 'professional' }])).toBe(true);
  });
});

describe('buyUrl', () => {
  it('points at the LMS buy view with the encoded run key', () => {
    getConfig.mockReturnValue({ LMS_BASE_URL: 'http://lms' });
    expect(buyUrl('course-v1:HDRUK+AIC001+2024'))
      .toBe('http://lms/hdruk/commerce/buy/?course_run_key=course-v1%3AHDRUK%2BAIC001%2B2024');
  });
});
