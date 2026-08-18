export default function DashboardLoading() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-80 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-10 w-40 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="mb-6 h-16 animate-pulse rounded-lg bg-white shadow-sm" />

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-white shadow-sm" />
        ))}
      </div>
    </div>
  );
}
