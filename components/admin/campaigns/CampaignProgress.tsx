export default function CampaignProgress({ total, completed, failed }: { total: number, completed: number, failed: number }) {
  const safeTotal = total > 0 ? total : 1;
  const percentComplete = Math.round((completed / safeTotal) * 100);
  const percentFailed = Math.round((failed / safeTotal) * 100);
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1 font-bold text-charcoal">
        <span>Progress</span>
        <span>{completed} / {total} ({percentComplete}%)</span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
        <div 
          className="h-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${percentComplete}%` }}
        />
        <div 
          className="h-full bg-red-400 transition-all duration-500"
          style={{ width: `${percentFailed}%` }}
        />
      </div>
    </div>
  );
}
