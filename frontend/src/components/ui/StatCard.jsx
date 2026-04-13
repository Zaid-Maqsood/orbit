import React from 'react';

const StatCard = ({ label, value, icon: Icon, color = 'primary', subtext }) => {
  const colorConfig = {
    primary: { border: 'border-primary', icon: 'text-primary bg-primary-50', text: 'text-primary-800' },
    green: { border: 'border-green-500', icon: 'text-green-600 bg-green-50', text: 'text-green-800' },
    orange: { border: 'border-cta', icon: 'text-cta bg-orange-50', text: 'text-orange-800' },
    red: { border: 'border-red-500', icon: 'text-red-600 bg-red-50', text: 'text-red-800' },
    blue: { border: 'border-blue-500', icon: 'text-blue-600 bg-blue-50', text: 'text-blue-800' },
    purple: { border: 'border-purple-500', icon: 'text-purple-600 bg-purple-50', text: 'text-purple-800' },
  };
  const c = colorConfig[color] || colorConfig.primary;

  return (
    <div className={`bg-white rounded-xl shadow-card border border-gray-100 border-l-4 ${c.border} p-5 flex items-center gap-4`}>
      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${c.icon}`}>
          <Icon size={22} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm text-gray-500 font-medium truncate">{label}</p>
        <p className={`font-heading font-bold text-2xl ${c.text}`}>{value}</p>
        {subtext && <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>}
      </div>
    </div>
  );
};

export default StatCard;
