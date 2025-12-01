import React from 'react';

export default function Alert({ type = 'info', title, message, onClose }) {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-700',
      text: 'text-green-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-700',
      text: 'text-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-700',
      text: 'text-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-700',
      text: 'text-blue-700',
    },
  };

  const style = types[type];

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <div className={`${style.icon} text-xl flex-shrink-0`}>
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'warning' && '⚠'}
          {type === 'info' && 'ℹ'}
        </div>
        <div className="flex-1">
          {title && <h3 className={`font-semibold ${style.text}`}>{title}</h3>}
          {message && <p className={style.text}>{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${style.text} text-lg font-semibold flex-shrink-0`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
