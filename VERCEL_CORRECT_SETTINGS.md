# ✅ Vercel Correct Settings (Root: apps/api)

## 🎯 **Correct Vercel Framework Settings:**

### **✅ If Root Directory is set to `apps/api`:**

**Framework Preset:**

- **Value**: "PHP" or "Other"

**Build Command:**

- **Value**: `composer install --no-dev --optimize-autoloader`
- **Override**: Toggle ON

**Install Command:**

- **Value**: `composer install`
- **Override**: Toggle ON

**Output Directory:**

- **Value**: `public`
- **Override**: Toggle ON

---

## 🚀 **Why No 'cd apps/api'?**

### **✅ Root Directory = apps/api**

- Vercel already starts in `apps/api/` directory
- No need to `cd` into it
- Commands run directly from `apps/api/`

### **✅ Commands:**

- `composer install` (not `cd apps/api && composer install`)
- `composer install --no-dev --optimize-autoloader` (not `cd apps/api && composer install --no-dev --optimize-autoloader`)
- `public` (not `apps/api/public`)

---

## 📊 **Settings Summary:**

| Field            | Value                                             | Override |
| ---------------- | ------------------------------------------------- | -------- |
| Framework Preset | PHP/Other                                         | -        |
| Build Command    | `composer install --no-dev --optimize-autoloader` | ✅ ON    |
| Install Command  | `composer install`                                | ✅ ON    |
| Output Directory | `public`                                          | ✅ ON    |

---

## 🚀 **Expected Result:**

- ✅ **PHP Detection**: Success
- ✅ **Composer**: Install dependencies
- ✅ **Build**: Optimize autoloader
- ✅ **Deploy**: PHP API successfully

---

_Correct settings for apps/api root directory!_ 🚀
