/**
 * SM-2 Spaced Repetition Scheduler for Quantitative Research Problem Drill.
 *
 * Grades:
 *  - "again": reset repetitions to 0, schedule 1 day out, reduce ease factor.
 *  - "hard":  3 days on initial review, gentle 1.2x growth thereafter, slightly reduce ease.
 *  - "good":  4 days on initial review, exponential ease growth thereafter, slight ease recovery.
 */

const MIN_EASE = 1.3;
const MAX_EASE = 3.0;
const DEFAULT_EASE = 2.5;
const VALID_GRADES = new Set(['again', 'hard', 'good']);

/**
 * Return local/UTC ISO date string YYYY-MM-DD when caller omits todayIso.
 * @returns {string}
 */
export function getTodayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Add an integer number of calendar days to an ISO YYYY-MM-DD date string using UTC.
 * @param {string} isoDate
 * @param {number} days
 * @returns {string}
 */
function addDaysIso(isoDate, days) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDate || '').trim());
  if (!match) {
    throw new Error(`Invalid ISO date string: "${isoDate}". Expected YYYY-MM-DD.`);
  }
  const year = Number(match[1]);
  const monthIdx = Number(match[2]) - 1;
  const day = Number(match[3]);
  const target = new Date(Date.UTC(year, monthIdx, day + days));
  const y = target.getUTCFullYear();
  const m = String(target.getUTCMonth() + 1).padStart(2, '0');
  const d = String(target.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function clampEase(val) {
  return Number(Math.min(MAX_EASE, Math.max(MIN_EASE, val)).toFixed(2));
}

/**
 * Compute next SM-2 review state after grading a problem attempt.
 *
 * @param {object|null|undefined} prevState
 * @param {"again"|"hard"|"good"} grade
 * @param {string} [todayIso]
 * @returns {{ ease: number, interval_days: number, repetitions: number, next_due: string, last_grade: string }}
 */
export function computeNextReview(prevState, grade, todayIso = getTodayIso()) {
  if (!VALID_GRADES.has(grade)) {
    throw new RangeError(`Unsupported SM-2 grade "${grade}". Expected "again", "hard", or "good".`);
  }

  const prevEase =
    prevState && typeof prevState.ease === 'number' && Number.isFinite(prevState.ease)
      ? Math.max(MIN_EASE, prevState.ease)
      : DEFAULT_EASE;
  const prevInterval =
    prevState && typeof prevState.interval_days === 'number' && prevState.interval_days > 0
      ? Math.floor(prevState.interval_days)
      : 0;
  const prevReps =
    prevState && typeof prevState.repetitions === 'number' && prevState.repetitions > 0
      ? Math.floor(prevState.repetitions)
      : 0;

  let ease = prevEase;
  let intervalDays = 1;
  let repetitions = 0;

  if (grade === 'again') {
    repetitions = 0;
    intervalDays = 1;
    ease = clampEase(prevEase - 0.2);
  } else if (grade === 'hard') {
    repetitions = prevReps + 1;
    ease = clampEase(prevEase - 0.15);
    intervalDays =
      prevReps === 0
        ? 3
        : Math.max(prevInterval + 1, Math.round(Math.max(prevInterval, 3) * 1.2));
  } else {
    repetitions = prevReps + 1;
    ease = clampEase(prevEase + 0.05);
    intervalDays =
      prevReps === 0
        ? 4
        : Math.max(prevInterval + 1, Math.round(Math.max(prevInterval, 4) * ease));
  }

  return {
    ease,
    interval_days: intervalDays,
    repetitions,
    next_due: addDaysIso(todayIso, intervalDays),
    last_grade: grade,
  };
}

/**
 * Determine whether a previously reviewed problem is due on or before todayIso.
 * Unseen problems (null/undefined reviewState) return false so they stay in the "Unseen" queue.
 *
 * @param {object|null|undefined} reviewState
 * @param {string} [todayIso]
 * @returns {boolean}
 */
export function isProblemDue(reviewState, todayIso = getTodayIso()) {
  if (!reviewState || typeof reviewState.next_due !== 'string' || !reviewState.next_due) {
    return false;
  }
  return reviewState.next_due <= todayIso;
}
