// src/components/__tests__/Loading.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingComponent from '../Loading';

// Mock NextUI Spinner component
jest.mock('@nextui-org/react', () => ({
  Spinner: jest.fn(({ label, color }) => {
    const React = require('react');
    return React.createElement('div', {
      'data-testid': 'spinner',
      'data-label': label,
      'data-color': color
    }, label);
  })
}));

describe('LoadingComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should render with default loading text when no label is provided', () => {
      render(<LoadingComponent />);
      
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('data-label', 'Loading...');
      expect(spinner).toHaveAttribute('data-color', 'default');
      expect(spinner).toHaveTextContent('Loading...');
    });

    it('should render with custom label when provided', () => {
      const customLabel = 'Processing your request...';
      render(<LoadingComponent label={customLabel} />);
      
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('data-label', customLabel);
      expect(spinner).toHaveTextContent(customLabel);
    });

    it('should render with correct CSS classes for positioning', () => {
      const { container } = render(<LoadingComponent />);
      
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('fixed', 'inset-0', 'flex', 'justify-center', 'items-center');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string label', () => {
      render(<LoadingComponent label="" />);
      
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-label', 'Loading...');
      expect(spinner).toHaveTextContent('Loading...');
    });

    it('should handle undefined label explicitly', () => {
      render(<LoadingComponent label={undefined} />);
      
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-label', 'Loading...');
      expect(spinner).toHaveTextContent('Loading...');
    });

    it('should handle very long label text', () => {
      const longLabel = 'This is a very long loading message that might wrap or cause layout issues in some scenarios and we want to make sure it renders correctly';
      render(<LoadingComponent label={longLabel} />);
      
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-label', longLabel);
      expect(spinner).toHaveTextContent(longLabel);
    });

    it('should handle special characters in label', () => {
      const specialLabel = 'Loading... 🚀 [100%] & "processing" <data>';
      render(<LoadingComponent label={specialLabel} />);
      
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-label', specialLabel);
      expect(spinner).toHaveTextContent(specialLabel);
    });

    it('should handle whitespace-only label', () => {
      render(<LoadingComponent label="   " />);
      
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-label', '   ');
      // React normalizes whitespace, so we check the data attribute instead
      expect(spinner.getAttribute('data-label')).toBe('   ');
    });
  });

  describe('Component Structure', () => {
    it('should render a single wrapper div with correct structure', () => {
      const { container } = render(<LoadingComponent />);
      
      expect(container.children).toHaveLength(1);
      expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
    });

    it('should render spinner inside the wrapper div', () => {
      render(<LoadingComponent />);
      
      const spinner = screen.getByTestId('spinner');
      const wrapper = spinner.parentElement;
      
      expect(wrapper).toHaveClass('fixed', 'inset-0', 'flex', 'justify-center', 'items-center');
    });

    it('should maintain consistent DOM structure across different props', () => {
      const { rerender, container } = render(<LoadingComponent />);
      const initialStructure = container.innerHTML;
      
      rerender(<LoadingComponent label="Custom label" />);
      
      // Structure should be the same, only content should change
      expect(container.firstChild).toHaveClass('fixed', 'inset-0', 'flex', 'justify-center', 'items-center');
      expect(container.children).toHaveLength(1);
    });
  });

  describe('Spinner Props', () => {
    it('should pass default color to Spinner', () => {
      render(<LoadingComponent />);
      
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-color', 'default');
    });

    it('should always use default color regardless of label', () => {
      render(<LoadingComponent label="Custom loading message" />);
      
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveAttribute('data-color', 'default');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible to screen readers', () => {
      render(<LoadingComponent />);
      
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toBeInTheDocument();
      
      // The text content should be available for screen readers
      expect(spinner).toHaveTextContent('Loading...');
    });

    it('should provide meaningful loading text for assistive technologies', () => {
      const accessibleLabel = 'Loading user profile data';
      render(<LoadingComponent label={accessibleLabel} />);
      
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveTextContent(accessibleLabel);
    });

    it('should not have any focusable elements', () => {
      const { container } = render(<LoadingComponent />);
      
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      expect(focusableElements).toHaveLength(0);
    });
  });

  describe('Styling and Layout', () => {
    it('should use fixed positioning to overlay content', () => {
      const { container } = render(<LoadingComponent />);
      const wrapper = container.firstChild as HTMLElement;
      
      expect(wrapper).toHaveClass('fixed');
      expect(wrapper).toHaveClass('inset-0');
    });

    it('should center content both horizontally and vertically', () => {
      const { container } = render(<LoadingComponent />);
      const wrapper = container.firstChild as HTMLElement;
      
      expect(wrapper).toHaveClass('flex');
      expect(wrapper).toHaveClass('justify-center');
      expect(wrapper).toHaveClass('items-center');
    });

    it('should maintain consistent styling across different labels', () => {
      const { container, rerender } = render(<LoadingComponent />);
      const initialClasses = (container.firstChild as HTMLElement).className;
      
      rerender(<LoadingComponent label="Different label" />);
      const updatedClasses = (container.firstChild as HTMLElement).className;
      
      expect(initialClasses).toBe(updatedClasses);
    });
  });

  describe('Re-rendering Behavior', () => {
    it('should update label when prop changes', () => {
      const { rerender } = render(<LoadingComponent label="Initial" />);
      
      let spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveTextContent('Initial');
      
      rerender(<LoadingComponent label="Updated" />);
      
      spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveTextContent('Updated');
    });

    it('should handle switching from custom label to default', () => {
      const { rerender } = render(<LoadingComponent label="Custom" />);
      
      let spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveTextContent('Custom');
      
      rerender(<LoadingComponent />);
      
      spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveTextContent('Loading...');
    });

    it('should handle switching from no label to custom label', () => {
      const { rerender } = render(<LoadingComponent />);
      
      let spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveTextContent('Loading...');
      
      rerender(<LoadingComponent label="Custom" />);
      
      spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveTextContent('Custom');
    });
  });

  describe('Integration with NextUI', () => {
    it('should pass correct props to NextUI Spinner component', () => {
      const { Spinner } = require('@nextui-org/react');
      
      render(<LoadingComponent label="Test" />);
      
      expect(Spinner).toHaveBeenCalledWith(
        {
          label: 'Test',
          color: 'default'
        },
        {}
      );
    });

    it('should pass default label when none provided', () => {
      const { Spinner } = require('@nextui-org/react');
      
      render(<LoadingComponent />);
      
      expect(Spinner).toHaveBeenCalledWith(
        {
          label: 'Loading...',
          color: 'default'
        },
        {}
      );
    });
  });
});