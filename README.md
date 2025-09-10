# Internationalization (i18n) Guide

## Cấu trúc thư mục

```
locales/
├── vi.json          # Tiếng Việt
├── en.json          # English
└── README.md        # Hướng dẫn này

lib/
├── i18n.js          # Core i18n logic
└── i18n-utils.js    # Utility functions

hooks/
└── useI18n.js       # Enhanced i18n hook

components/
└── LanguageToggle.js # Language switcher component
```

## Cách sử dụng

### 1. Basic Translation

```jsx
import { useI18n } from '@/hooks/useI18n';

function MyComponent() {
  const { t } = useI18n();

  return (
    <div>
      <h1>{t('home.hero.title')}</h1>
      <p>{t('home.hero.subtitle')}</p>
    </div>
  );
}
```

### 2. Enhanced Hook (Recommended)

```jsx
import { useI18n } from '@/hooks/useI18n';

function MyComponent() {
  const { t, formatDate, formatNumber } = useI18n();
  
  return (
    <div>
      <h1>{t('events.title')}</h1>
      <p>Date: {formatDate(new Date())}</p>
      <p>Participants: {formatNumber(1500)}</p>
    </div>
  );
}
```

### 3. Translation with Parameters

```jsx
// In JSON file:
{
  "welcome": "Xin chào {{name}}, bạn có {{count}} tin nhắn mới"
}

// In component:
const message = t('welcome', { name: 'John', count: 5 });
// Result: "Xin chào John, bạn có 5 tin nhắn mới"
```

### 4. Language Switcher

```jsx
import { LanguageToggle } from '@/components/LanguageToggle';

// Dropdown variant (default)
<LanguageToggle />

// Toggle variant (compact)
<LanguageToggle variant="toggle" />
```

### 5. Formatting Functions

```jsx
const { formatDate, formatTime, formatCurrency, getRelativeTime } = useI18n();

// Date formatting
formatDate(new Date(), { month: 'short', day: 'numeric' });

// Time formatting
formatTime(new Date());

// Currency formatting
formatCurrency(100000); // "100.000 ₫" (vi) or "$100,000" (en)

// Relative time
getRelativeTime(new Date(Date.now() - 3600000)); // "1 giờ trước"
```

## Cấu trúc JSON

### Nested Structure (Recommended)

```json
{
  "nav": {
    "home": "Trang chủ",
    "about": "Giới thiệu"
  },
  "home": {
    "hero": {
      "title": "CampusConnect",
      "subtitle": "Kết nối sự kiện đại học"
    }
  }
}
```

### Usage with nested keys:
```jsx
t('nav.home')        // "Trang chủ"
t('home.hero.title') // "CampusConnect"
```

## Thêm ngôn ngữ mới

### 1. Tạo file JSON mới

```bash
# Tạo file cho tiếng Nhật
touch locales/ja.json
```

### 2. Cập nhật supported languages

```js
// lib/i18n.js
export const SUPPORTED_LANGUAGES = ['vi', 'en', 'ja'];
```

### 3. Thêm translations

```json
// locales/ja.json
{
  "nav": {
    "home": "ホーム",
    "about": "について"
  }
}
```

## Best Practices

### 1. Key Naming Convention

```
section.subsection.item
```

Examples:
- `nav.home` - Navigation items
- `home.hero.title` - Homepage hero section
- `common.loading` - Common UI elements
- `form.validation.required` - Form validations

### 2. Organize by Feature

```json
{
  "auth": {
    "login": "Đăng nhập",
    "register": "Đăng ký",
    "forgot": "Quên mật khẩu"
  },
  "events": {
    "title": "Sự kiện",
    "create": "Tạo sự kiện",
    "edit": "Chỉnh sửa"
  }
}
```

### 3. Use Parameters for Dynamic Content

```json
{
  "event": {
    "participants": "{{count}} người tham gia",
    "timeRange": "Từ {{start}} đến {{end}}"
  }
}
```

### 4. Fallback Strategy

- Missing key → return key itself
- Missing language → fallback to Vietnamese
- Loading state → show loading indicator

## Common Patterns

### 1. Conditional Rendering

```jsx
const { t, language } = useI18n();

return (
  <div>
    {language === 'vi' ? (
      <p>Nội dung tiếng Việt</p>
    ) : (
      <p>English content</p>
    )}
    <p>{t('common.or')}</p>
    <p>{t('common.message')}</p>
  </div>
);
```

### 2. Form Validation Messages

```jsx
const { getFormTranslations } = useI18n();
const formT = getFormTranslations();

const validationSchema = {
  email: {
    required: formT.required,
    pattern: formT.email
  }
};
```

### 3. Navigation Menu

```jsx
const { getNavTranslations } = useI18n();
const navT = getNavTranslations();

const menuItems = [
  { href: '/', label: navT.home },
  { href: '/about', label: navT.about },
  { href: '/events', label: navT.events }
];
```

## Performance Tips

1. **Lazy Loading**: Translations are loaded only when needed
2. **Caching**: Loaded translations are cached in memory
3. **Code Splitting**: Each language file is a separate chunk
4. **Fallback**: Efficient fallback mechanism prevents errors

## Troubleshooting

### Translation not showing
- Check if key exists in JSON file
- Verify JSON syntax is valid
- Ensure component is wrapped in LanguageProvider

### Loading issues
- Check file path in import statement
- Verify JSON file is in correct location
- Check browser network tab for loading errors

### Performance issues
- Use React.memo for components with many translations
- Avoid calling t() in render loops
- Consider using translation groups for related keys
