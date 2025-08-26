import React from 'react';
import { Card } from './ui';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon }) => {
  return (
    <Card>
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg p-3">
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
            <dd>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
            </dd>
          </dl>
        </div>
      </div>
    </Card>
  );
};

export default DashboardCard;