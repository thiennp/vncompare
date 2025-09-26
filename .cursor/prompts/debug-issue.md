# Debug Issue - VNCompare.com

## 🎯 Context

You are working on VNCompare.com, a paint comparison platform for Vietnam. Before debugging any issue, you MUST:

1. **Read `AI_PROJECT_CONTEXT.md`** to understand the project structure
2. **Identify which application** is affected (web, admin, backoffice, api)
3. **Understand the business logic** related to the issue

## 🔍 Debugging Process

### 1. Initial Assessment

#### Identify the Scope

- **Frontend Issue**: Next.js web app or Angular admin/backoffice
- **Backend Issue**: Symfony API or Node.js gateway
- **Database Issue**: PostgreSQL with Prisma or Doctrine
- **Integration Issue**: Between different applications

#### Gather Information

- **Error Messages**: Copy exact error text
- **Console Logs**: Check browser console and server logs
- **Network Requests**: Inspect API calls and responses
- **User Steps**: Reproduce the issue step by step

### 2. Business Logic Context

#### Paint-Specific Issues

- **Coverage Calculator**: Check m²/liter calculations
- **Price Calculations**: Verify base price + shipping + taxes
- **Address Validation**: Ensure Vietnam address system works
- **Color Matching**: Validate paint color selection

#### Vietnam-Specific Issues

- **Address System**: Provinces, districts, wards hierarchy
- **Currency Formatting**: VND display and calculations
- **Phone Validation**: Vietnamese phone number format
- **Language Support**: Vietnamese text rendering

### 3. Application-Specific Debugging

#### Next.js Web App (`apps/web/`)

```bash
# Check development server
npm run dev

# Check build process
npm run build

# Check TypeScript errors
npm run type-check

# Check linting
npm run lint
```

**Common Issues:**

- Hydration mismatches
- API route errors
- Prisma database connection
- NextAuth authentication
- Tailwind CSS not applying

#### Angular Admin (`apps/admin/`)

```bash
# Check development server
ng serve

# Check build process
ng build

# Check linting
ng lint

# Run tests
ng test
```

**Common Issues:**

- NgRx state management
- Angular Material theming
- Service injection errors
- Form validation issues
- HTTP interceptor problems

#### Angular Backoffice (`apps/backoffice/`)

```bash
# Check development server
ng serve

# Check build process
ng build
```

**Common Issues:**

- Component lifecycle issues
- Service dependencies
- Form handling
- Data binding problems

#### Symfony API (`apps/api/`)

```bash
# Check server status
symfony server:status

# Check logs
tail -f var/log/dev.log

# Check database
php bin/console doctrine:schema:validate

# Run tests
php bin/phpunit
```

**Common Issues:**

- JWT authentication
- Doctrine ORM queries
- Validation errors
- CORS issues
- Database connection

### 4. Database Debugging

#### Prisma (Web App)

```bash
# Check database connection
npx prisma db pull

# Reset database
npm run db:reset

# Check migrations
npx prisma migrate status

# Open Prisma Studio
npx prisma studio
```

#### Doctrine (API)

```bash
# Check schema
php bin/console doctrine:schema:validate

# Run migrations
php bin/console doctrine:migrations:migrate

# Check database connection
php bin/console doctrine:database:create
```

### 5. Common Issue Patterns

#### Coverage Calculator Issues

```typescript
// Check the formula implementation
const paintNeeded = (totalArea / coverageRate) * numberOfCoats;

// Verify coverage rate is in m²/liter
// Check if area is in m²
// Ensure number of coats is positive
```

#### Address Validation Issues

```typescript
// Check Vietnam address hierarchy
interface Address {
  province: string; // Tỉnh/Thành phố
  district: string; // Quận/Huyện
  ward: string; // Phường/Xã
  street: string;
  houseNumber: string;
}
```

#### Price Calculation Issues

```typescript
// Verify total price calculation
const totalPrice = basePrice + shippingCost + tax + additionalFees;

// Check VND formatting
const formattedPrice = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
}).format(price);
```

### 6. Debugging Tools

#### Browser DevTools

- **Console**: Check for JavaScript errors
- **Network**: Inspect API requests/responses
- **Elements**: Check DOM structure and CSS
- **Application**: Check localStorage, sessionStorage
- **Performance**: Check for performance issues

#### Server Logs

```bash
# Symfony logs
tail -f apps/api/var/log/dev.log

# Next.js logs
# Check terminal where dev server is running

# Angular logs
# Check terminal where ng serve is running
```

#### Database Tools

- **Prisma Studio**: `npx prisma studio`
- **pgAdmin**: PostgreSQL administration
- **Database CLI**: `psql` for direct database access

### 7. Testing the Fix

#### Unit Tests

```bash
# Next.js
npm test

# Angular
ng test

# Symfony
php bin/phpunit
```

#### Integration Tests

- Test the complete user flow
- Verify API endpoints work correctly
- Check database operations
- Test authentication flow

#### Manual Testing

- Test in different browsers
- Test on different screen sizes
- Test with different user roles
- Test edge cases and error conditions

### 8. Common Error Solutions

#### "Hydration failed" (Next.js)

- Check for server/client rendering differences
- Use `useEffect` for client-only code
- Ensure consistent data between server and client

#### "Cannot read property of undefined" (JavaScript)

- Add null checks and optional chaining
- Use TypeScript strict mode
- Implement proper error boundaries

#### "CORS error" (API)

- Check CORS configuration in Symfony
- Verify allowed origins
- Check preflight requests

#### "Database connection failed"

- Check database credentials
- Verify database server is running
- Check network connectivity
- Verify database exists

#### "Authentication failed"

- Check JWT token validity
- Verify token expiration
- Check user permissions
- Validate request headers

### 9. Performance Issues

#### Slow Page Loads

- Check bundle size
- Implement code splitting
- Optimize images
- Use caching strategies

#### Slow API Responses

- Check database queries
- Add proper indexes
- Implement caching
- Optimize N+1 queries

#### Memory Leaks

- Check for event listeners
- Verify component cleanup
- Check for circular references
- Monitor memory usage

### 10. Documentation

#### Document the Issue

- **Problem**: Clear description of the issue
- **Root Cause**: What caused the problem
- **Solution**: How the issue was fixed
- **Prevention**: How to avoid similar issues

#### Update Tests

- Add tests for the fixed issue
- Update existing tests if needed
- Add regression tests
- Document test scenarios

## 🚨 Important Reminders

1. **Always read `AI_PROJECT_CONTEXT.md` first**
2. **Understand the business context** of the issue
3. **Check all related applications** and services
4. **Test thoroughly** before considering the issue resolved
5. **Document the solution** for future reference
6. **Consider performance implications** of the fix
7. **Update tests** to prevent regression
8. **Communicate the fix** to the team

## 📚 Reference Files

- `AI_PROJECT_CONTEXT.md`: Project overview and architecture
- `apps/api/var/log/`: Symfony API logs
- `apps/web/.next/`: Next.js build logs
- `apps/admin/dist/`: Angular build output
- `apps/backoffice/dist/`: Angular build output

## 🔧 Quick Commands

```bash
# Check all services
npm run dev                    # Start all development servers
docker-compose up -d          # Start database and services
symfony server:start          # Start Symfony API server

# Database operations
npm run db:reset              # Reset and seed database
php bin/console doctrine:migrations:migrate  # Run migrations

# Testing
npm test                      # Run all tests
php bin/phpunit              # Run PHP tests
ng test                      # Run Angular tests
```

---

**Remember**: This is a Vietnam-specific paint comparison platform. Always consider the local market requirements, address system, and business logic when debugging issues.
