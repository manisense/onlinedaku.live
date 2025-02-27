'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSort, FaSortUp, FaSortDown, FaEye, FaLink } from 'react-icons/fa';
import toast from 'react-hot-toast';
import DealModal from './components/DealModal';
import DealFilters from './components/DealFilters';
import Pagination from './components/Pagination';
import DealStats from './components/DealStats';
// import BulkActions from './components/BulkActions';
import ExportButton from './components/ExportButton';
import DealPreview from './components/DealPreview';
import Loader from '@/components/ui/Loader';
import { confirmDelete, confirmStatusChange } from '@/utils/confirmDialog';
import LinkDealModal from '@/components/admin/LinkDealModal';
import Image from 'next/image';

interface Deal {
  _id: string;
  title: string;
  description: string;
  store: string;
  category: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  couponCode?: string;
  image?: string;
}

interface FilterState {
  search: string;
  category: string;
  status: string;
  store: string;
}

interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalDeals: number;
}

// Helper function to truncate text
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export default function DealsAndCoupons() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'createdAt',
    order: 'desc'
  });
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalDeals: 0
  });
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalDeals: 0,
    activeDeals: 0,
    expiredDeals: 0,
    upcomingDeals: 0
  });
  const [previewDeal, setPreviewDeal] = useState<Deal | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/deals', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch deals');
      }

      const data = await response.json();
      setDeals(data.deals);
      setFilteredDeals(data.deals);
    } catch (err) {
      console.error(err);
      setError('Failed to load deals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
    fetchStats();
  }, [fetchDeals]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/deals/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleStatusToggle = async (dealId: string, currentStatus: boolean) => {
    const confirmed = await confirmStatusChange(
      currentStatus ? 'deactivate' : 'activate',
      'deal'
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/deals/${dealId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update local state
      setDeals(deals.map(deal => 
        deal._id === dealId ? { ...deal, isActive: !currentStatus } : deal
      ));
      setFilteredDeals(filteredDeals.map(deal => 
        deal._id === dealId ? { ...deal, isActive: !currentStatus } : deal
      ));
      toast.success(`Deal ${currentStatus ? 'deactivated' : 'activated'} successfully`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update deal status');
    }
  };

  const handleAddDeal = async (dealData: Omit<Deal, '_id'>) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/deals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealData),
      });

      if (!response.ok) {
        throw new Error('Failed to add deal');
      }

      const { deal } = await response.json();
      
      // Update both deals and filteredDeals arrays with the new deal
      setDeals(prevDeals => [deal, ...prevDeals]);
      setFilteredDeals(prevDeals => [deal, ...prevDeals]);
      
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        totalDeals: prevStats.totalDeals + 1,
        activeDeals: deal.isActive ? prevStats.activeDeals + 1 : prevStats.activeDeals
      }));

      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      setError('Failed to add deal');
    }
  };

  const handleEditDeal = async (dealData: Omit<Deal, '_id'>) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/deals/${selectedDeal?._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealData),
      });

      if (!response.ok) {
        throw new Error('Failed to update deal');
      }

      // Refresh deals list
      fetchDeals();
      setShowAddModal(false);
      setSelectedDeal(null);
    } catch (err) {
      console.error(err);
      throw new Error('Failed to update deal');
    }
  };

  const handleDelete = async (dealId: string) => {
    const confirmed = await confirmDelete('deal');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/deals/${dealId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete deal');
      }

      toast.success('Deal deleted successfully');
      setDeals(deals.filter(deal => deal._id !== dealId));
      setFilteredDeals(filteredDeals.filter(deal => deal._id !== dealId));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete deal');
    }
  };

  const filterDeals = (deals: Deal[], filters: FilterState) => {
    return deals.filter(deal => {
      const matchesSearch = !filters.search || 
        deal.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        deal.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory = filters.category === 'All' || 
        deal.category === filters.category;

      const matchesStatus = filters.status === 'All' || 
        (filters.status === 'Active' ? deal.isActive : !deal.isActive);

      const matchesStore = !filters.store || 
        deal.store.toLowerCase().includes(filters.store.toLowerCase());

      return matchesSearch && matchesCategory && matchesStatus && matchesStore;
    });
  };

  const handleFilterChange = (filters: FilterState) => {
    setFilteredDeals(filterDeals(deals, filters));
  };

  const handleSort = (field: string) => {
    const newOrder = sortConfig.field === field && sortConfig.order === 'asc' ? 'desc' : 'asc';
    setSortConfig({ field, order: newOrder });
    fetchDeals();
  };

  // const handleBulkDelete = async () => {
  //   const confirmed = await confirmBulkDelete(selectedDeals.length, 'deals');
  //   if (!confirmed) return;

  //   try {
  //     const token = localStorage.getItem('adminToken');
  //     const response = await fetch('/api/admin/deals/bulk', {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         action: 'delete',
  //         dealIds: selectedDeals
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to delete deals');
  //     }

  //     setSelectedDeals([]);
  //     fetchDeals();
  //     fetchStats();
  //     toast.success('Selected deals deleted successfully');
  //   } catch (err) {
  //     console.error(err);
  //     toast.error('Failed to delete deals');
  //   }
  // };

  // const handleBulkStatusChange = async (status: boolean) => {
  //   try {
  //     const token = localStorage.getItem('adminToken');
  //     const response = await fetch('/api/admin/deals/bulk', {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         action: status ? 'activate' : 'deactivate',
  //         dealIds: selectedDeals
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Failed to ${status ? 'activate' : 'deactivate'} deals`);
  //     }

  //     setSelectedDeals([]);
  //     fetchDeals();
  //     fetchStats();
  //   } catch (err) {
  //     console.error(err);
  //     setError(`Failed to ${status ? 'activate' : 'deactivate'} deals`);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="large" text="Loading deals data..." />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Deals & Coupons</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all deals and coupons from various stores
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
          <ExportButton />
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setShowLinkModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-l-md text-white bg-blue-600 hover:bg-blue-700 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <FaLink className="mr-2" /> Add from URL
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <FaPlus className="mr-2" /> Add Manually
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <DealFilters onFilterChange={handleFilterChange} />

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <input
                        type="checkbox"
                        checked={selectedDeals.length === filteredDeals.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDeals(filteredDeals.map(deal => deal._id));
                          } else {
                            setSelectedDeals([]);
                          }
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th 
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center">
                        Title
                        {sortConfig.field === 'title' ? (
                          sortConfig.order === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                        ) : (
                          <FaSort className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Store</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Discount</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Valid Until</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredDeals.map((deal) => (
                    <tr key={deal._id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <input
                          type="checkbox"
                          checked={selectedDeals.includes(deal._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDeals([...selectedDeals, deal._id]);
                            } else {
                              setSelectedDeals(selectedDeals.filter(id => id !== deal._id));
                            }
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          {deal.image && (
                            <div className="h-10 w-10 flex-shrink-0 mr-3">
                              <Image
                                src={deal.image}
                                alt={deal.title}
                                width={40}
                                height={40}
                                className="h-10 w-10 object-cover rounded-md"
                                onError={(e) => {
                                  // Fallback image
                                  e.currentTarget.src = '/product-placeholder.png';
                                }}
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{truncateText(deal.title, 60)}</div>
                            <div className="text-xs text-gray-500">
                              {truncateText(deal.description, 80)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {deal.store}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {deal.discountType === 'percentage' ? `${deal.discountValue}%` : `$${deal.discountValue}`}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(deal.endDate).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <button
                          onClick={() => handleStatusToggle(deal._id, deal.isActive)}
                          className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                            deal.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {deal.isActive ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                          {deal.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <button
                          onClick={() => {
                            setSelectedDeal(deal);
                            setShowAddModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(deal._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={() => setPreviewDeal(deal)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={(page) => {
          setPagination(prev => ({ ...prev, currentPage: page }));
          fetchDeals();
        }}
      />

      <DealModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedDeal(null);
        }}
        onSubmit={selectedDeal ? handleEditDeal : handleAddDeal}
        deal={selectedDeal}
      />

      <LinkDealModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onSubmit={async (dealData) => {
          await handleAddDeal({ 
            ...dealData, 
            category: 'other',
            description: dealData.description || '',
            image: dealData.image || '',
            discountType: dealData.discountType as 'percentage' | 'fixed',
            startDate: dealData.startDate.toISOString(),
            endDate: dealData.endDate.toISOString()
          });
        }}
      />

      <DealStats {...stats} />
      {/* <BulkActions
        selectedDeals={selectedDeals}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        onClearSelection={() => setSelectedDeals([])}
      /> */}

      {previewDeal && (
        <DealPreview
          deal={previewDeal}
          onClose={() => setPreviewDeal(null)}
        />
      )}
    </div>
  );
}