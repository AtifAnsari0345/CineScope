import React from 'react';

/**
 * Button Component
 * 
 * A highly reusable, accessible, and visually stunning button component
 * built on top of the CineScope Design System.
 * 
 * @param {Object} props
 * @param {'primary' | 'install' | 'secondary' | 'ghost'} [props.variant='primary'] - The visual style of the button.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - The size of the button.
 * @param {boolean} [props.isLoading=false] - Whether the button is in a loading state.
 * @param {boolean} [props.isFullWidth=false] - Whether the button should take up the full width of its container.
 * @param {React.ReactNode} [props.icon] - An optional icon to display before the text.
 * @param {React.ReactNode} props.children - The content of the button.
 * @param {string} [props.className] - Additional CSS classes to apply.
 */
const Button = React.forwardRef(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isFullWidth = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}, ref) => {
  
  // Base classes applied to all buttons
  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    font-accent tracking-[0.15em] uppercase
    transition-all duration-250 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary focus-visible:ring-yellow-400
    active:scale-[0.97]
    disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
    overflow-hidden relative
  `;

  // Size variations
  const sizeClasses = {
    sm: 'h-9 px-5 text-[11px] rounded-lg tracking-[0.15em]',
    md: 'h-11 px-6 text-base rounded-xl',
    lg: 'h-14 px-8 text-lg rounded-2xl',
  };

  // Visual variants
  const variantClasses = {
    primary: `
      bg-yellow-400 text-black 
      hover:bg-yellow-300 
      shadow-[0_0_15px_var(--btn-primary-shadow)] 
      hover:shadow-[0_0_25px_var(--btn-primary-shadow-hover)]
      border border-yellow-300/50
    `,
    install: `
      bg-emerald-500 text-white
      hover:bg-emerald-400
      shadow-[0_4px_10px_rgba(16,185,129,0.16)]
      hover:shadow-[0_6px_14px_rgba(16,185,129,0.2)]
      border border-emerald-300/60
    `,
    secondary: `
      bg-white/5 text-white 
      hover:bg-white/10 
      border border-white/10
      backdrop-blur-sm
    `,
    ghost: `
      bg-transparent text-surface-300
      hover:text-white hover:bg-white/5
    `
  };

  const widthClass = isFullWidth ? 'w-full' : '';
  const loadingClass = isLoading ? 'pointer-events-none' : '';

  // Combine all classes
  const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${widthClass}
    ${loadingClass}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <button
      ref={ref}
      className={combinedClasses}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit z-10">
          <div className={`h-5 w-5 border-2 border-t-transparent rounded-full animate-spin ${variant === 'primary' ? 'border-black' : 'border-white'}`} />
        </div>
      )}

      {/* Icon */}
      {icon && (
        <span className={`flex-shrink-0 ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          {icon}
        </span>
      )}

      {/* Content */}
      <span className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200 flex items-center gap-2`}>
        {children}
      </span>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
