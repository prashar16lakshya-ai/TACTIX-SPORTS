import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InputField from '../components/onboarding/InputField';

describe('InputField Component', () => {
  it('renders with label and placeholder', () => {
    render(
      <InputField 
        id="test-input" 
        label="Test Label" 
        placeholder="Enter text" 
        icon="person" 
        value="" 
        onChange={() => {}} 
      />
    );
    expect(screen.getByLabelText(/Test Label/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter text/i)).toBeInTheDocument();
  });

  it('shows error message and applies shake animation', () => {
    render(
      <InputField 
        id="test-input" 
        label="Test Label" 
        error="Invalid input" 
        icon="person" 
        value="" 
        onChange={() => {}} 
      />
    );
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent(/Invalid input/i);
    const inputWrapper = errorMessage.parentElement.previousSibling;
    expect(inputWrapper).toHaveClass('animate-shake');
  });

  it('toggles password visibility when eye icon is clicked', () => {
    const onTogglePassword = vi.fn();
    const { rerender } = render(
      <InputField 
        id="password" 
        label="Password" 
        type="password"
        icon="lock" 
        value="secret123" 
        showPassword={false}
        onTogglePassword={onTogglePassword}
        onChange={() => {}} 
      />
    );

    const input = screen.getByLabelText(/^Password/i);
    expect(input).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByLabelText(/Show password/i);
    fireEvent.click(toggleButton);
    expect(onTogglePassword).toHaveBeenCalled();

    rerender(
      <InputField 
        id="password" 
        label="Password" 
        type="password"
        icon="lock" 
        value="secret123" 
        showPassword={true}
        onTogglePassword={onTogglePassword}
        onChange={() => {}} 
      />
    );
    expect(input).toHaveAttribute('type', 'text');
  });

  it('shows loading spinner when loading is true', () => {
    render(
      <InputField 
        id="test-input" 
        label="Test Label" 
        loading={true}
        icon="person" 
        value="" 
        onChange={() => {}} 
      />
    );
    // The spinner is aria-hidden, so we check by class or container
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
