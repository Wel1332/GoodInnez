import toast from 'react-hot-toast';

export const toastService = {
  success: (message) => toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#10b981',
      color: '#fff',
      borderRadius: '8px',
      fontWeight: '500',
    },
  }),

  error: (message) => toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#ef4444',
      color: '#fff',
      borderRadius: '8px',
      fontWeight: '500',
    },
  }),

  loading: (message) => toast.loading(message, {
    position: 'top-right',
    style: {
      background: '#3b82f6',
      color: '#fff',
      borderRadius: '8px',
      fontWeight: '500',
    },
  }),

  promise: (promise, messages) => toast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Error occurred',
    },
    {
      position: 'top-right',
      style: {
        borderRadius: '8px',
        fontWeight: '500',
      },
    }
  ),
};

export const dismissAllToasts = () => toast.remove();
