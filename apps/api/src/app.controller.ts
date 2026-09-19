import { Body, Controller, Get, Headers, HttpCode, Post } from '@nestjs/common';
import { GuestService } from './guest.service.js';
import { parseContentReportInput } from './report-input.js';
import { ReportsService } from './reports.service.js';

@Controller('v1')
export class AppController {
  constructor(
    private readonly guests: GuestService,
    private readonly reports: ReportsService,
  ) {}

  @Get('health')
  health(): { status: 'ok'; apiVersion: 1 } {
    return { status: 'ok', apiVersion: 1 };
  }

  @Post('guest-sessions')
  async createGuest(): Promise<{ guestId: string; accessToken: string }> {
    return this.guests.create();
  }

  @Post('content-reports')
  @HttpCode(200)
  async saveReport(@Headers('authorization') authorization: string | undefined, @Body() body: unknown): Promise<{ id: string; duplicate: boolean }> {
    const guestId = await this.guests.requireGuest(authorization);
    return this.reports.save(guestId, parseContentReportInput(body));
  }
}
