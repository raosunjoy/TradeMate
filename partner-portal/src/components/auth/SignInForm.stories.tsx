import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SignInForm from './SignInForm';

const meta: Meta<typeof SignInForm> = {
  title: 'Authentication/SignInForm',
  component: SignInForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive sign-in form with email/password authentication and social login options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: {
      description: 'Callback function called when form is submitted',
      action: 'submitted',
    },
    onSocialSignIn: {
      description: 'Callback function called when social sign-in is attempted',
      action: 'social-signin',
    },
    isLoading: {
      description: 'Whether the form is in a loading state',
      control: 'boolean',
    },
    error: {
      description: 'Error message to display',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    onSubmit: action('form-submitted'),
    onSocialSignIn: action('social-signin'),
    isLoading: false,
    error: undefined,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};

// With error
export const WithError: Story = {
  args: {
    ...Default.args,
    error: 'Invalid credentials. Please check your email and password.',
  },
};

// Pre-filled form
export const PreFilled: Story = {
  args: {
    ...Default.args,
    defaultValues: {
      email: 'demo@example.com',
      password: '',
    },
  },
};

// Mobile view
export const Mobile: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
};

// Dark background
export const DarkBackground: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};