export const SCHEDULE_PRESETS = {
  every_10m:       { label: 'Every 10 minutes',         cron: '*/10 * * * *' },
  every_30m:       { label: 'Every 30 minutes',         cron: '*/30 * * * *' },
  every_1h:        { label: 'Every hour',               cron: '0 * * * *' },
  every_3h:        { label: 'Every 3 hours',            cron: '0 */3 * * *' },
  every_6h:        { label: 'Every 6 hours',            cron: '0 */6 * * *' },
  every_12h:       { label: 'Every 12 hours',           cron: '0 */12 * * *' },
  daily_9am:       { label: 'Daily at 9:00 AM',         cron: '0 9 * * *' },
  daily_6pm:       { label: 'Daily at 6:00 PM',         cron: '0 18 * * *' },
  weekdays_9am:    { label: 'Weekdays at 9:00 AM',      cron: '0 9 * * 1-5' },
  business_hours:  { label: 'Business hours (9-6, M-F)', cron: '0 9-18 * * 1-5' },
  weekly_monday:   { label: 'Weekly (Monday 9 AM)',      cron: '0 9 * * 1' },
  monthly_first:   { label: 'Monthly (1st at 9 AM)',     cron: '0 9 1 * *' },
  custom:          { label: 'Custom cron expression',    cron: null },
} as const;

export type SchedulePresetKey = keyof typeof SCHEDULE_PRESETS;

export function getCronFromPreset(presetKey: string, customCron?: string): string | null {
  if (presetKey === 'custom') {
    return customCron || null;
  }
  const preset = SCHEDULE_PRESETS[presetKey as SchedulePresetKey];
  return preset ? preset.cron : null;
}
