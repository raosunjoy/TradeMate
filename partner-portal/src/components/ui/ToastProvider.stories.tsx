import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ToastProvider from './ToastProvider';
import { useToastStore } from '@/store/toast';
import React from 'react';

// Demo component that uses toasts
const ToastDemo: React.FC = () => {
  const { addToast, removeToast, clearAllToasts } = useToastStore();

  const showSuccessToast = () => {
    addToast({
      type: 'success',
      title: 'Success!',
      message: 'Your action was completed successfully.',
    });
    action('success-toast-added')();
  };

  const showErrorToast = () => {
    addToast({
      type: 'error',
      title: 'Error Occurred',
      message: 'Something went wrong. Please try again.',
    });
    action('error-toast-added')();
  };

  const showWarningToast = () => {
    addToast({
      type: 'warning',
      title: 'Warning',
      message: 'Please review your settings before proceeding.',
    });
    action('warning-toast-added')();
  };

  const showInfoToast = () => {
    addToast({
      type: 'info',
      title: 'Information',
      message: 'Here is some useful information for you.',
    });
    action('info-toast-added')();
  };

  const showPersistentToast = () => {
    addToast({
      type: 'info',
      title: 'Persistent Toast',
      message: 'This toast will not auto-dismiss.',
      persistent: true,
    });
    action('persistent-toast-added')();
  };

  const showLongToast = () => {
    addToast({
      type: 'success',
      title: 'Long Message Toast',
      message: 'This is a very long message that demonstrates how the toast component handles longer content. It should wrap properly and maintain good readability even with extended text content.',
    });
    action('long-toast-added')();
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Toast Notifications Demo</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <button
          onClick={showSuccessToast}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Success Toast
        </button>
        
        <button
          onClick={showErrorToast}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Error Toast
        </button>
        
        <button
          onClick={showWarningToast}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
        >
          Warning Toast
        </button>
        
        <button
          onClick={showInfoToast}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Info Toast
        </button>
        
        <button
          onClick={showPersistentToast}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          Persistent Toast
        </button>
        
        <button
          onClick={showLongToast}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Long Message
        </button>
      </div>
      
      <div className="pt-4 border-t border-slate-200">
        <button
          onClick={() => {
            clearAllToasts();
            action('all-toasts-cleared')();
          }}
          className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
        >
          Clear All Toasts
        </button>
      </div>
    </div>
  );
};

const meta: Meta<typeof ToastProvider> = {
  title: 'Components/ToastProvider',
  component: ToastProvider,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A toast notification provider that manages and displays toast messages throughout the application. Supports different types, auto-dismiss, and persistent toasts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      description: 'Position where toasts should appear',
      control: {
        type: 'select',
        options: ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'],
      },
    },
    maxToasts: {
      description: 'Maximum number of toasts to display at once',
      control: {
        type: 'number',
        min: 1,
        max: 10,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with demo
export const Default: Story = {
  args: {
    position: 'top-right',
    maxToasts: 5,
  },
  render: (args) => (
    <ToastProvider {...args}>
      <ToastDemo />
    </ToastProvider>
  ),
};

// Different positions
export const TopLeft: Story = {
  args: {
    position: 'top-left',
    maxToasts: 5,
  },
  render: (args) => (
    <ToastProvider {...args}>
      <ToastDemo />
    </ToastProvider>
  ),
};

export const BottomRight: Story = {
  args: {
    position: 'bottom-right',
    maxToasts: 5,
  },
  render: (args) => (
    <ToastProvider {...args}>
      <ToastDemo />
    </ToastProvider>
  ),
};

export const TopCenter: Story = {
  args: {
    position: 'top-center',
    maxToasts: 3,
  },
  render: (args) => (
    <ToastProvider {...args}>
      <ToastDemo />
    </ToastProvider>
  ),
};

// Limited toasts
export const LimitedToasts: Story = {
  args: {
    position: 'top-right',
    maxToasts: 2,
  },
  render: (args) => (
    <ToastProvider {...args}>
      <div className="p-8">
        <h2 className="text-xl font-bold mb-4">Limited to 2 Toasts</h2>
        <p className="text-slate-600 mb-6">Only 2 toasts will be shown at a time. Try clicking multiple buttons quickly.</p>
        <ToastDemo />
      </div>
    </ToastProvider>
  ),
};

// Mobile view
export const Mobile: Story = {
  args: {
    position: 'top-center',
    maxToasts: 3,
  },
  render: (args) => (
    <ToastProvider {...args}>
      <ToastDemo />
    </ToastProvider>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
};

// Dark theme
export const DarkTheme: Story = {
  args: {
    position: 'top-right',
    maxToasts: 5,
  },
  render: (args) => (
    <div className="bg-slate-900 min-h-screen">
      <ToastProvider {...args}>
        <ToastDemo />
      </ToastProvider>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};