import { createIndustry } from '../actions';
import { IndustryForm } from '@/components/admin/IndustryForm';

export default function NewIndustryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Create Industry</h1>
        <p className="text-gray-500 mt-1">Add a new industry vertical to your platform.</p>
      </div>
      <IndustryForm action={createIndustry} />
    </div>
  );
}
