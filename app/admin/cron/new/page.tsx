import CronJobForm from '@/components/admin/cron/CronJobForm';
import { createCronJob } from '../actions';

export default function NewCronJobPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <CronJobForm action={createCronJob} />
    </div>
  );
}
