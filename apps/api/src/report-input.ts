import { BadRequestException } from '@nestjs/common';

const CONTENT_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REASONS = ['answer', 'explanation', 'typo', 'prompt'] as const;

export interface ContentReportInput {
  contentId: string;
  contentVersion: number;
  reason: typeof REASONS[number];
  createdAt: string;
}

export function parseContentReportInput(value: unknown): ContentReportInput {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new BadRequestException('A content report object is required.');
  }
  const input = value as Record<string, unknown>;
  if (typeof input.contentId !== 'string' || input.contentId.length > 120 || !CONTENT_ID_PATTERN.test(input.contentId)) {
    throw new BadRequestException('contentId must be a stable content ID.');
  }
  if (!Number.isSafeInteger(input.contentVersion) || (input.contentVersion as number) < 1) {
    throw new BadRequestException('contentVersion must be a positive integer.');
  }
  if (!REASONS.includes(input.reason as ContentReportInput['reason'])) {
    throw new BadRequestException('reason is not supported.');
  }
  if (typeof input.createdAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(input.createdAt) || Number.isNaN(Date.parse(input.createdAt))) {
    throw new BadRequestException('createdAt must be an ISO date-time.');
  }
  return {
    contentId: input.contentId,
    contentVersion: input.contentVersion as number,
    reason: input.reason as ContentReportInput['reason'],
    createdAt: input.createdAt,
  };
}
