import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-primary-500 text-gray-900 hover:bg-primary-600 focus:ring-primary-500 dark:focus:ring-offset-black',
    secondary: 'bg-gray-200 text-gray-800 border border-gray-300 hover:bg-gray-300 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-offset-black',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:focus:ring-offset-black',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-500/10 focus:ring-primary-500 dark:text-primary-400 dark:hover:bg-primary-500/10 dark:focus:ring-offset-black',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

type CardProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({ children, className = '', title, actions }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl transition-all duration-300 hover:border-gray-300 hover:-translate-y-1 dark:bg-black dark:border-gray-800 dark:hover:border-gray-700 ${className}`}>
        {(title || actions) && (
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 border-b border-gray-200 dark:border-gray-800">
                {title && <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100">{title}</h3>}
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
        )}
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
};

type BadgeProps = {
    children: React.ReactNode;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple';
    className?: string;
};

export const Badge: React.FC<BadgeProps> = ({ children, color = 'gray', className = '' }) => {
    const colorStyles = {
        blue: 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-500/20',
        green: 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-500/20',
        yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-500/20',
        red: 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/50 dark:text-red-200 dark:border-red-500/20',
        gray: 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-700/50 dark:text-gray-200 dark:border-gray-500/20',
        purple: 'bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-500/20',
    };
    const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize';
    return <span className={`${baseStyles} ${colorStyles[color]} ${className}`}>{children}</span>;
};

const formElementStyles = "block w-full rounded-lg border-0 bg-gray-100 dark:bg-gray-800/50 py-2.5 px-3.5 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6 transition-all duration-150 ease-in-out hover:ring-gray-400 dark:hover:ring-gray-600 disabled:cursor-not-allowed disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 disabled:ring-gray-300 dark:disabled:ring-gray-700";

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
  return <input className={`${formElementStyles} ${className}`} {...props} />;
};

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className = '', children, ...props }) => {
  return <label className={`block text-sm font-medium leading-6 text-gray-700 dark:text-gray-300 mb-2 ${className}`} {...props}>{children}</label>;
};

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = '', children, ...props }) => {
  const customSelectStyles = "appearance-none bg-no-repeat bg-right-2 bg-[length:1.4em_1.4em] pr-10 bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3e%3c/svg%3e')] dark:bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%239ca3af%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3e%3c/svg%3e')]";
  return <select className={`${formElementStyles} ${customSelectStyles} ${className}`} {...props}>{children}</select>;
};

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = '', ...props }) => {
    return <textarea rows={4} className={`${formElementStyles} ${className}`} {...props} />
}

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' }> = ({ isOpen, onClose, title, children, size = 'lg' }) => {
    if (!isOpen) return null;
    
    const sizeClasses = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    };

    return (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500/50 dark:bg-black/70 backdrop-blur-sm transition-opacity"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className={`relative transform overflow-hidden rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 text-left shadow-2xl transition-all sm:my-8 sm:w-full ${sizeClasses[size]}`}>
                        <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block z-10">
                            <button type="button" onClick={onClose} className="rounded-md bg-transparent text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900">
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:ml-0 sm:mt-0 sm:text-left w-full">
                                    <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100" id="modal-title">{title}</h3>
                                    <div className="mt-4 w-full">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}
export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-14 w-14 text-base',
        xl: 'h-20 w-20 text-xl',
    }

    if (src) {
        return (
            <img 
                src={src} 
                alt={name || 'Avatar'}
                className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
            />
        )
    }

    const initial = name ? name.charAt(0).toUpperCase() : '?';

    return (
        <span className={`inline-flex items-center justify-center rounded-full bg-primary-500 text-gray-900 font-bold ${sizeClasses[size]} ${className}`}>
            {initial}
        </span>
    );
};

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ headers, children, className = '' }) => {
    return (
        <div className={`w-full overflow-hidden ${className}`}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-black/50">
                    <tr>
                        {headers.map((header) => (
                            <th key={header} scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
                    {children}
                </tbody>
            </table>
        </div>
    );
};