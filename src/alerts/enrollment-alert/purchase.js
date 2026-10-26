import { getConfig } from '@edx/frontend-platform';

// HDR UK: a course sold through Stripe Checkout may carry no free mode at
// all. The enrolment API then refuses the mode-less POST the enrol button
// sends, so such a course gets a link to the LMS buy view instead. The
// course home metadata lists the modes by slug; the buy view resolves the
// course's paid mode from the run key on its own.

const FREE_MODE_SLUGS = ['audit', 'honor'];

export function requiresPurchase(courseModes) {
  if (!Array.isArray(courseModes) || courseModes.length === 0) {
    return false;
  }
  return !courseModes.some((mode) => FREE_MODE_SLUGS.includes(mode.slug));
}

export function buyUrl(courseId) {
  return `${getConfig().LMS_BASE_URL}/hdruk/commerce/buy/?course_run_key=${encodeURIComponent(courseId)}`;
}
