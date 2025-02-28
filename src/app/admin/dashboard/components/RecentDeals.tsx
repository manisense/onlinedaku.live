interface Deal {
  _id: string;
  title: string;
  store: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

interface RecentDealsProps {
  deals: Deal[];
}

export default function RecentDeals({ deals }: RecentDealsProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Store
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {deals.map((deal) => (
            <tr key={deal._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{deal.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{deal.store}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(deal.createdAt).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    deal.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {deal.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {deals.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500">No recent deals</p>
        </div>
      )}
    </div>
  );
}
