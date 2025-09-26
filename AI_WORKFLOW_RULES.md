# AI Workflow Rules for VNCompare.com

## 🎯 Primary Rule: Always Reference AI_PROJECT_CONTEXT.md

**CRITICAL**: Before performing ANY task on this project, you MUST:

1. **Read** the `AI_PROJECT_CONTEXT.md` file first
2. **Understand** the current project structure and business logic
3. **Reference** the appropriate sections for your task
4. **Update** the `AI_PROJECT_CONTEXT.md` file after completing any significant work

## 📋 Workflow Process

### Before Starting Any Task

1. **Read AI_PROJECT_CONTEXT.md** - Get full project context
2. **Identify** which application(s) are affected (web, admin, backoffice, api)
3. **Check** existing patterns and conventions
4. **Plan** your approach based on the documented architecture

### During Development

1. **Follow** established patterns and conventions
2. **Maintain** consistency across all applications
3. **Test** critical business logic (coverage calculator, address validation)
4. **Document** any new patterns or conventions

### After Completing Work

1. **Update** `AI_PROJECT_CONTEXT.md` with any changes made
2. **Add** new features, patterns, or important notes
3. **Update** the "Last Updated" timestamp
4. **Ensure** the file remains the single source of truth

## 🔍 Key Areas to Always Check

### Business Logic

- **Coverage Calculator**: Paint quantity calculations (m²/liter)
- **Vietnam Address System**: Provinces, districts, wards
- **Price Calculations**: Base price + shipping + taxes
- **Shipping Zones**: Complex geographic calculations

### Technical Architecture

- **Monorepo Structure**: Multiple apps with Turbo
- **Database**: PostgreSQL with Prisma (web) and Doctrine (API)
- **Authentication**: JWT for API, NextAuth for web
- **State Management**: Zustand + TanStack Query (web), NgRx (admin)

### Critical Files

- `apps/web/`: Next.js frontend
- `apps/admin/`: Angular admin panel
- `apps/backoffice/`: Additional backoffice
- `apps/api/`: Symfony API backend
- `AI_PROJECT_CONTEXT.md`: Project context and guidelines

## ⚠️ Important Reminders

### Always Validate

- Vietnam addresses using the proper administrative divisions
- Coverage calculations with real-world paint specifications
- Price calculations including all components
- Authentication and authorization across all apps

### Maintain Consistency

- Follow established naming conventions
- Use consistent patterns across applications
- Keep documentation up to date
- Test critical business logic thoroughly

### Update Documentation

- Add new features to AI_PROJECT_CONTEXT.md
- Update architecture diagrams if needed
- Document new patterns or conventions
- Keep the "Last Updated" timestamp current

## 🚨 Critical Business Rules

### Coverage Calculator

```
Paint Needed (liters) = Total Area (m²) ÷ Coverage Rate (m²/liter) × Number of Coats
```

### Price Calculation

```
Total Price = Base Price + Shipping Cost + Taxes + Additional Fees
```

### Vietnam Address Hierarchy

1. Province (Tỉnh/Thành phố) - 63 total
2. District (Quận/Huyện) - Within provinces
3. Ward (Phường/Xã) - Within districts

## 📝 Documentation Standards

### When to Update AI_PROJECT_CONTEXT.md

- Adding new features or components
- Changing architecture or patterns
- Adding new dependencies or tools
- Modifying business logic or calculations
- Updating deployment or configuration

### What to Include

- Clear descriptions of new features
- Updated architecture diagrams
- New patterns or conventions
- Important business rules
- Critical technical decisions

## 🔄 Regular Maintenance

### Weekly Tasks

- Review and update AI_PROJECT_CONTEXT.md
- Check for outdated information
- Ensure all new features are documented
- Verify critical business logic is accurate

### Before Major Releases

- Comprehensive review of AI_PROJECT_CONTEXT.md
- Update all architecture diagrams
- Verify all business rules are current
- Ensure deployment instructions are accurate

---

**Remember**: The `AI_PROJECT_CONTEXT.md` file is the single source of truth for this project. Always refer to it first, and always keep it updated. This ensures consistent, informed development across all team members and AI assistants.

**Last Updated**: [Current Date]
**Version**: 1.0
