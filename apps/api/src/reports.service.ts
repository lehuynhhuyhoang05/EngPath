import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service.js';
import type { ContentReportInput } from './report-input.js';

interface ReportRow { id: string; reported_at: Date }

@Injectable()
export class ReportsService {
  constructor(private readonly db: DatabaseService) {}

  async save(guestId: string, report: ContentReportInput): Promise<{ id: string; duplicate: boolean }> {
    const values = [guestId, report.contentId, report.contentVersion, report.reason, report.createdAt];
    const inserted = await this.db.query<ReportRow>(
      `INSERT INTO content_reports (guest_id, content_id, content_version, reason, reported_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (guest_id, content_id, content_version, reason) DO NOTHING
       RETURNING id, reported_at`,
      values,
    );
    if (inserted.length) return { id: inserted[0].id, duplicate: false };
    const existing = await this.db.query<ReportRow>(
      `SELECT id, reported_at FROM content_reports
       WHERE guest_id = $1 AND content_id = $2 AND content_version = $3 AND reason = $4`,
      values.slice(0, 4),
    );
    if (!existing.length) throw new Error('Idempotent content report was not found after conflict.');
    return { id: existing[0].id, duplicate: true };
  }
}
