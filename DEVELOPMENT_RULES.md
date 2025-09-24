# Development Rules

## Data Source Rule - CRITICAL

**NEVER use hardcoded or mock data in the application. All data must always come from the database.**

### What this means:
- API responses should query the database, not return static arrays
- Controllers should use repositories to fetch real data
- No hardcoded arrays like `$supplierData = [...]` in controllers
- All data fixtures should be used only for seeding, not as runtime data sources
- Dashboard metrics, analytics, and all business data must be calculated from actual database records

### Examples of what NOT to do:
```php
// ❌ WRONG - Hardcoded data in controller
$supplierData = [
    ['companyName' => 'KOVA', ...],
    ['companyName' => 'Jotun', ...]
];
return $this->json($supplierData);
```

### Examples of what TO do:
```php
// ✅ CORRECT - Data from database
$suppliers = $this->supplierRepository->findAll();
return $this->json($suppliers);
```

### Enforcement:
- All controllers must use repositories
- All API endpoints must return database data
- Dashboard metrics must be calculated from real data
- No static arrays in production code
