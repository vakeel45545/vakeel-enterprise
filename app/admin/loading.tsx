export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full text-gray-500">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin"></div>
      <p className="mt-4 font-medium animate-pulse">Loading workspace...</p>
    </div>
  );
}
