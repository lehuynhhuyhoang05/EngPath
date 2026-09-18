import type { ContentReport, ContentReportReason } from './models';

export function recordContentReport(
  reports: ContentReport[],
  contentId: string,
  contentVersion: number,
  reason: ContentReportReason,
  createdAt = new Date().toISOString(),
): ContentReport[] {
  if (reports.some((report) => report.contentId === contentId && report.contentVersion === contentVersion && report.reason === reason)) {
    return reports;
  }
  return [...reports, { contentId, contentVersion, reason, createdAt }];
}
