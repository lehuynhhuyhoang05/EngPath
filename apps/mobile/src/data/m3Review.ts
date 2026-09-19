import type { ContentMetadata } from '../domain/models';

// These IDs correspond to the seven questions and two lessons in the M3 review packet.
// The exam template and all other prototype content remain drafts.
export const M3_REVIEWED_CONTENT_IDS = new Set([
  'diag-relative-clause-01',
  'diag-first-conditional-01',
  'lesson-relative-clause-01',
  'exit-relative-clause-01',
  'lesson-first-conditional-01',
  'exit-first-conditional-01',
  'exam-sample-conditional-01',
  'exam-sample-relative-01',
  'exam-sample-reading-01',
]);

type ReviewMetadata = Pick<ContentMetadata, 'status' | 'source' | 'review' | 'version'>;

export function m3ReviewMetadata(
  id: string,
  draftSource: ContentMetadata['source'],
  reviewedSource: ContentMetadata['source'],
): ReviewMetadata {
  if (!M3_REVIEWED_CONTENT_IDS.has(id)) {
    return { status: 'draft', source: draftSource, review: {}, version: 1 };
  }
  return {
    status: 'reviewed',
    source: reviewedSource,
    review: { reviewerId: 'english-teacher-01', reviewedAt: '2026-09-18' },
    version: 2,
  };
}
