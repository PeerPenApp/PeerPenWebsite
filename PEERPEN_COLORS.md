# PeerPen Brand Color Palette & Design System

## 🎨 Primary Colors

### Mint Collection
- **Mint 50**: `#f0fffe` - Lightest mint (backgrounds)
- **Mint 100**: `#ccfffd` - Very light mint (hover states)
- **Mint 200**: `#99fffb` - Light mint (borders)
- **Mint 300**: `#66fff9` - Medium light mint
- **Mint 400**: `#33fff7` - Medium mint
- **Mint 500**: `#C0FDFB` - **Primary mint** (main brand color)
- **Mint 600**: `#99fbf8` - Medium dark mint
- **Mint 700**: `#66f9f5` - Dark mint (text on light backgrounds)
- **Mint 800**: `#33f7f2` - Very dark mint
- **Mint 900**: `#00f5ef` - Darkest mint

### Sky Collection
- **Sky 50**: `#f0fbff` - Lightest sky (backgrounds)
- **Sky 100**: `#ccf3ff` - Very light sky (hover states)
- **Sky 200**: `#99e7ff` - Light sky (borders)
- **Sky 300**: `#66dbff` - Medium light sky
- **Sky 400**: `#33cfff` - Medium sky
- **Sky 500**: `#A3E7FC` - **Primary sky** (main brand color)
- **Sky 600**: `#80d9f9` - Medium dark sky
- **Sky 700**: `#5dcbf6` - Dark sky (text on light backgrounds)
- **Sky 800**: `#3abdf3` - Very dark sky
- **Sky 900**: `#17aff0` - Darkest sky

## 🎯 Neutral Colors
- **Primary**: `#000000` - Black (text, buttons)
- **Secondary**: `#ffffff` - White (backgrounds, text on dark)

## 🌈 Gradients
- **Mint to Sky**: `linear-gradient(135deg, #C0FDFB 0%, #A3E7FC 100%)`
- **Sky to Mint**: `linear-gradient(135deg, #A3E7FC 0%, #C0FDFB 100%)`
- **Mint Dark**: `linear-gradient(135deg, #C0FDFB 0%, #66f9f5 100%)`
- **Sky Dark**: `linear-gradient(135deg, #A3E7FC 0%, #5dcbf6 100%)`

## 🎭 Usage Guidelines

### Text Colors
- **Primary text**: `#000000` (black)
- **Secondary text**: `#6b7280` (gray-500)
- **Accent text**: `#C0FDFB` (mint-500) or `#A3E7FC` (sky-500)
- **Gradient text**: Use `.gradient-text` class for animated gradient text

### Background Colors
- **Primary background**: `#ffffff` (white)
- **Secondary background**: `#f9fafb` (gray-50)
- **Accent backgrounds**: Use mint-50 or sky-50 for subtle highlights
- **Gradient backgrounds**: Use `.bg-gradient-mint-sky` or `.bg-gradient-sky-mint`

### Interactive Elements
- **Buttons**: Use gradient backgrounds with hover lift effects
- **Links**: Use mint-500 or sky-500 with hover states
- **Form inputs**: Use mint borders with focus states
- **Cards**: Use subtle shadows with hover lift animations

## 🎨 CSS Classes Available

### Text Colors
```css
.text-mint          /* Primary mint color */
.text-sky           /* Primary sky color */
.text-mint-light    /* Light mint */
.text-sky-light     /* Light sky */
.text-mint-dark     /* Dark mint */
.text-sky-dark      /* Dark sky */
```

### Background Colors
```css
.bg-mint            /* Primary mint background */
.bg-sky             /* Primary sky background */
.bg-mint-light      /* Light mint background */
.bg-sky-light       /* Light sky background */
.bg-gradient-mint-sky    /* Mint to sky gradient */
.bg-gradient-sky-mint    /* Sky to mint gradient */
```

### Interactive Effects
```css
.hover-lift         /* Hover lift animation */
.glow               /* Glow effect on hover */
.gradient-text      /* Animated gradient text */
.float              /* Floating animation */
.pulse              /* Pulse animation */
.slide-up           /* Slide up animation */
```

## 🚀 Implementation Examples

### Button Styling
```html
<button class="btn hover-lift glow">Join the Waitlist</button>
```

### Gradient Text
```html
<h1 class="gradient-text">Write together. Get in alone.</h1>
```

### Card with Hover Effects
```html
<div class="card hover-lift bg-mint-light">
  <h3 class="text-primary">Card Title</h3>
  <p class="text-gray-600">Card content</p>
</div>
```

### Form Input with Focus States
```html
<input type="email" class="glow focus-mint" placeholder="Your email" />
```

## 📱 Responsive Considerations
- Use mint-50 and sky-50 for mobile backgrounds to ensure readability
- Gradient text should have sufficient contrast on all devices
- Hover effects should work on touch devices with appropriate fallbacks

## 🎯 Brand Voice
The mint and sky palette conveys:
- **Freshness** - Like a breath of fresh air
- **Innovation** - Modern, forward-thinking
- **Trust** - Professional yet approachable
- **Youth** - Perfect for student-focused platform
- **Collaboration** - The blend of colors suggests working together

This color system is designed to be accessible, memorable, and perfectly suited for PeerPen's mission of helping students write better essays together. 