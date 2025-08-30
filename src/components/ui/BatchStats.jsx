import React from 'react';
import { FileText, CheckCircle, Clock, Pause } from 'lucide-react';

const BatchStats = ({ batches }) => {
  const stats = [
    {
      icon: FileText,
      value: batches.length,
      label: 'Total Batches',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: CheckCircle,
      value: batches.filter(b => b.status === 'completed').length,
      label: 'Completed',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: Clock,
      value: batches.filter(b => b.status === 'processing').length,
      label: 'Processing',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      icon: Pause,
      value: batches.filter(b => b.status === 'pending').length,
      label: 'Pending',
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
            <h3 className="text-lg lg:text-xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default BatchStats;