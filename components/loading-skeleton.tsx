export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse border border-stone-400 p-6 bg-stone-50">
      <div className="h-8 bg-stone-300 w-3/4"></div>
      <div className="h-64 bg-stone-300"></div>
      <div className="space-y-3">
        <div className="h-4 bg-stone-300"></div>
        <div className="h-4 bg-stone-300 w-5/6"></div>
      </div>
    </div>
  );
}
