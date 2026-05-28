# TACTIX Logo Management System

## Asset Organization
Assets are organized in `src/assets/logo/` with the following structure:
- `icons/`: App icons in various sizes (16x16, 32x32, 48x48, 64x64, 128x128, 256x256, 512x512, 1024x1024).
- `splash/`: Splash screen logos for iOS and Android.
- `header/`: Full horizontal logos for app headers.
- `favicon/`: Favicon variations.
- `light/`: Light mode variants.
- `dark/`: Dark mode variants.

## Usage Guidelines

### Logo Component
The `<Logo />` component in `src/components/common/Logo.jsx` is the primary way to display the logo. It supports dynamic theme switching and different variations.

#### Props:
- `variant`: `'icon'`, `'header'`, `'splash'`, `'favicon'` (default: `'header'`)
- `size`: `'sm'`, `'md'`, `'lg'`, `'xl'` or a number in pixels (default: `'md'`)
- `theme`: `'light'`, `'dark'`, `'auto'` (default: `'auto'`)
- `className`: Additional CSS classes

#### Example:
```jsx
import Logo from './components/common/Logo';

// Auto-switching header logo
<Logo variant="header" size="md" />

// Large splash logo for dark mode only
<Logo variant="splash" size="lg" theme="dark" />
```

## Color Specifications
- **Primary Green**: `#44e78e` (used in logos and accents)
- **Background Dark**: `#0e150f`
- **Text On Dark**: `#dde5db`

## Placement Rules
1. **Login/Signup**: Use `variant="header"` with `size="lg"`.
2. **TopBar**: Use `variant="header"` with `size="sm"`.
3. **User Setup**: Use `variant="header"` with `size="md"`.
4. **Splash Screen**: Use `variant="splash"` with `size="xl"`.
