export default function MetricCard({ title, value, change, changeType }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
        {title}
      </h3>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-white">{value}</p>
        {change && (
          <span className={`text-xs px-2 py-1 rounded ${
            changeType === 'up' ? 'text-green-400 bg-green-900/20' : 'text-red-400 bg-red-900/20'
          }`}>
            {changeType === 'up' ? '↗' : '↘'} {change}%
          </span>
        )}
      </div>
    </div>
  );
}