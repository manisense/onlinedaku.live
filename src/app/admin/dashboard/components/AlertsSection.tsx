interface Alert {
  _id: string;
  message: string;
  type: 'warning' | 'info' | 'error';
  createdAt: string;
}

interface AlertsSectionProps {
  alerts: Alert[];
}

export default function AlertsSection({ alerts }: AlertsSectionProps) {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert._id}
          className={`p-4 rounded-lg ${
            alert.type === 'warning'
              ? 'bg-yellow-50 text-yellow-700'
              : alert.type === 'error'
              ? 'bg-red-50 text-red-700'
              : 'bg-blue-50 text-blue-700'
          }`}
        >
          <p className="text-sm">{alert.message}</p>
          <p className="text-xs mt-1 opacity-75">
            {new Date(alert.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
      {alerts.length === 0 && (
        <p className="text-gray-500 text-sm">No recent alerts</p>
      )}
    </div>
  );
}
