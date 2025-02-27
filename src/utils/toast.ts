import { toast } from 'react-hot-toast';

/**
 * Simple toast utility wrapper around react-hot-toast
 */
const showToast = {
  /**
   * Show a success toast
   */
  success: (message: string) => toast.success(message),
  
  /**
   * Show an error toast
   */
  error: (message: string) => toast.error(message),
  
  /**
   * Show a loading toast
   */
  loading: (message: string) => toast.loading(message),
  
  /**
   * Dismiss a toast by id or dismiss all if no id provided
   */
  dismiss: (toastId?: string) => toast.dismiss(toastId),

  /**
   * Show a custom toast
   */
  custom: (message: string) => toast(message),
};

export default showToast;
