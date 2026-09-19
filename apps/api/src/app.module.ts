import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { DatabaseService } from './database.service.js';
import { GuestService } from './guest.service.js';
import { ReportsService } from './reports.service.js';

@Module({
  controllers: [AppController],
  providers: [DatabaseService, GuestService, ReportsService],
})
export class AppModule {}
