# Unified Programmatic Site - Implementation Tasks

## Project Overview
Building a single public site where Next.js generates all pages and sitemaps; CMS supplies structured content only. Target: <10min build for 10k+ pages, 0 sitemap errors, Core Web Vitals compliance.

## Phase 1: Core Infrastructure (Week 1)

### Task 1.1: Generic Page Generation System
**Objective:** Implement configurable dynamic route generation for programmatic pages

**Tasks:**
- [x] Create generic dynamic route structure: `/:category/:identifier/`
- [x] Implement CMS-driven category configuration system
- [x] Add category management UI in admin panel
- [x] Create category schema with:
  - Category name (e.g., "currency", "swift", "hsn")
  - URL pattern (e.g., ":base-:quote", ":code", ":country")
  - Template type (e.g., "converter", "directory", "news")
  - Active status and priority
- [x] Implement build-time page generation based on CMS categories
- [x] Add locale-specific routing (`/en/`, `/hi/`, etc.)

**Guardrails:**
- Build time must be < 10 minutes for 10k pages
- Memory usage < 4GB during build
- All routes must have valid TypeScript types
- No duplicate route patterns
- Locale coverage must be 100% for all categories
- Category names must be URL-safe (alphanumeric + hyphens only)
- Maximum 50 active categories per site
- Category URL patterns must be unique

**Acceptance Criteria:**
- All programmatic routes generate valid pages
- Build completes within time limits
- No TypeScript errors
- Locale prefixes work correctly
- Categories can be added/removed via CMS without code changes
- Category configuration is validated before build
- URL patterns resolve correctly for all category types

### Task 1.2: CMS Integration & Data Fetching
**Objective:** Complete CMS API integration with build-time data fetching

**Tasks:**
- [x] Implement CMS data fetching at build time
- [x] Add error handling and retry logic
- [x] Create data caching strategy
- [x] Add fallback content system

**Guardrails:**
- CMS API timeout: 30 seconds max
- Max 100 requests per build to CMS
- Required fields validation for all data
- Fallback content if CMS unavailable
- No secrets in build artifacts

**Acceptance Criteria:**
- ✅ Menus and blocks load successfully
- ✅ Build fails gracefully if CMS unavailable
- ✅ Data validation passes
- ✅ No API timeouts during build
- ✅ Build completes successfully with 324 static pages generated

### Task 1.3: Category Management System
**Objective:** Implement CMS-driven category configuration and management

**Tasks:**
- [x] Create category management API endpoints
- [x] Build category configuration UI in admin panel
- [x] Implement category validation and constraints
- [x] Add category activation/deactivation workflow
- [x] Create category template mapping system
- [x] Add category-specific data source configuration
- [x] Add "Add Category" button at top level for easy access

**Guardrails:**
- Category names must be URL-safe (alphanumeric + hyphens only)
- Maximum 50 active categories per site
- Category URL patterns must be unique
- Category changes must trigger build validation
- No circular dependencies in category relationships
- Category deletion must handle existing pages gracefully

**Acceptance Criteria:**
- ✅ Categories can be created/edited/deleted via UI
- ✅ Category changes trigger appropriate builds
- ✅ Validation prevents invalid configurations
- ✅ Existing pages handle category changes gracefully
- ✅ Category management is role-based and secure
- ✅ Build completes successfully with 327 static pages generated
- ✅ "Add Category" button prominently displayed at top level for quick access

### Task 1.4: Content Block System
**Objective:** Implement deterministic content rotation system

**Tasks:**
- [x] Create block components (benefit, cta, faq, promo)
- [x] Implement deterministic selection algorithm
- [x] Add weight and constraint validation
- [x] Create block slot system

**Guardrails:**
- Same content for same page + deploy SHA
- Weight constraints must be respected
- Mutually exclusive blocks validation
- All blocks must have reviewed=true flag
- Required slots must have content

**Acceptance Criteria:**
- ✅ Content rotates deterministically
- ✅ Constraints are properly enforced
- ✅ No empty slots in production
- ✅ Block selection is consistent across builds
- ✅ Modern, user-friendly admin interface
- ✅ Comprehensive validation and error handling
- ✅ Build completes successfully with 329 static pages generated

## Phase 2: SEO & Quality (Week 2)

### Task 2.1: SEO Implementation ✅ **COMPLETED**
**Objective:** Comprehensive SEO metadata and structured data

**Tasks:**
- [x] Generate dynamic titles and descriptions ✅ **COMPLETED**
- [x] Implement canonical URLs ✅ **COMPLETED**
- [x] Add hreflang tags ✅ **COMPLETED**
- [x] Create JSON-LD structured data ✅ **COMPLETED**
- [x] Add breadcrumb navigation ✅ **COMPLETED**

**Guardrails:**
- Titles ≤ 580px (character limit)
- Descriptions ≤ 160 characters
- No duplicate canonical URLs
- Valid hreflang implementation
- JSON-LD validation (sampled per page type)
- All pages must have unique titles

**Acceptance Criteria:**
- ✅ All pages have proper SEO metadata
- ✅ Canonical URLs resolve correctly
- ✅ hreflang tags are valid
- ✅ JSON-LD passes validation
- ✅ No SEO duplicates
- ✅ Breadcrumb navigation implemented
- ✅ SEO validation admin panel created

### Task 2.2: Dynamic Sitemap Generation ✅ **COMPLETED**
**Objective:** Comprehensive sitemap system with validation for configurable categories

**Tasks:**
- [x] Generate section sitemaps per category×locale dynamically
- [x] Create unified sitemap index that adapts to active categories
- [x] Add robots.txt generation
- [x] Implement sitemap validation
- [x] Add category-based sitemap chunking

**Guardrails:**
- Max 50,000 URLs per sitemap file
- Max 50MB uncompressed per file
- No duplicate URLs across sitemaps
- All intended URLs must be present
- Sitemap index must be valid XML
- Sitemaps must include only active categories
- Category changes must trigger sitemap regeneration

**Acceptance Criteria:**
- Sitemaps generate without errors
- All programmatic pages included
- File size limits respected
- No duplicate URLs
- robots.txt points to sitemap
- Sitemaps adapt to category changes automatically
- Only active categories appear in sitemaps

### Task 2.3: Performance Optimization ✅ **COMPLETED**
**Objective:** Meet Core Web Vitals and Lighthouse budgets

**Tasks:**
- [x] Implement ISR/On-Demand Builders ✅ **COMPLETED**
- [x] Optimize bundle splitting ✅ **COMPLETED**
- [x] Add image optimization ✅ **COMPLETED**
- [x] Implement caching strategies ✅ **COMPLETED**
- [x] Add performance monitoring dashboard ✅ **COMPLETED**
- [x] Set up build performance tracking ✅ **COMPLETED**
- [x] Implement lazy loading ✅ **COMPLETED**
- [x] Add performance guardrails ✅ **COMPLETED**

**Guardrails:**
- Performance ≥ 85 (mobile)
- SEO ≥ 95
- Accessibility ≥ 90
- Best Practices ≥ 90
- LCP ≤ 2.5s (desktop)
- CLS ≤ 0.1
- TTI ≤ 4s

**Acceptance Criteria:**
- ✅ Lighthouse scores meet budgets
- ✅ Core Web Vitals pass
- ✅ Bundle sizes optimized
- ✅ Images properly optimized
- ✅ Performance monitoring dashboard implemented
- ✅ Core Web Vitals monitoring active
- ✅ Bundle analysis available
- ✅ Optimization recommendations provided

## Phase 3: Analytics & Monitoring (Week 3)

### Task 3.1: GTM Integration
**Objective:** Google Tag Manager setup with dataLayer events

**Tasks:**
- [ ] Add GTM snippet to base layout
- [ ] Implement dataLayer events
- [ ] Add consent mode
- [ ] Configure IP anonymization

**Guardrails:**
- No PII in analytics
- Consent mode properly configured
- IP anonymization enabled
- CSP headers with GTM allowlist
- No tracking on admin pages

**Acceptance Criteria:**
- GTM loads correctly
- Events fire properly
- Consent mode works
- No PII leakage

### Task 3.2: Build Monitoring
**Objective:** Comprehensive build and deployment monitoring

**Tasks:**
- [ ] Add build duration tracking
- [ ] Implement error monitoring
- [ ] Add performance metrics
- [ ] Create alerting system

**Guardrails:**
- Build success rate > 95%
- Max build time: 10 minutes
- Error rate < 0.1%
- 99.9% uptime requirement
- Page load time < 3s for 95% of users

**Acceptance Criteria:**
- Build metrics tracked
- Alerts configured
- Error monitoring active
- Performance tracked

### Task 3.3: CI/CD Pipeline
**Objective:** Automated quality gates and validation

**Tasks:**
- [ ] Add Lighthouse CI integration
- [ ] Implement sitemap validation
- [ ] Add SEO quality checks
- [ ] Create automated testing

**Guardrails:**
- All tests must pass before deployment
- Lighthouse budgets enforced
- Sitemap validation required
- No critical console errors
- TypeScript strict mode

**Acceptance Criteria:**
- CI pipeline blocks bad builds
- Quality gates enforced
- Automated testing runs
- Validation reports generated

## Phase 4: Content & Localization (Week 4)

### Task 4.1: Dynamic Localization System
**Objective:** Complete multi-language support for configurable categories

**Tasks:**
- [x] Global locale management in admin panel
- [x] CSV upload for locale management
- [x] Locale validation and constraints
- [x] Implement locale-specific routing ✅ **COMPLETED**
- [ ] Add translation management
- [ ] Add hreflang consistency checks
- [ ] Add category-specific localization support
- [ ] Implement category name translations

**Guardrails:**
- All locales must have complete menu coverage
- No missing translations for critical content
- Locale-specific constraints validation
- hreflang consistency across all pages
- 100% locale coverage for all active categories
- Category names must be translatable
- Category changes must update all locale variants

**Acceptance Criteria:**
- All locales work correctly
- Translations complete
- hreflang consistent
- No missing content
- Category names translate properly
- New categories inherit locale support automatically

### Task 4.2: Content Quality Assurance
**Objective:** Ensure content meets quality standards

**Tasks:**
- [ ] Add content validation
- [ ] Implement review workflow
- [ ] Create content freshness checks
- [ ] Add image validation

**Guardrails:**
- All blocks must have reviewed=true flag
- No stale content (> 30 days old)
- Alt text required for all images
- No broken images
- Content review status validation

**Acceptance Criteria:**
- Content validation passes
- Review workflow works
- Fresh content only
- Images properly validated

### Task 4.3: Charts & Data Visualization
**Objective:** Interactive charts for FX and historical data

**Tasks:**
- [ ] Integrate Chart.js
- [ ] Add historical data visualization
- [ ] Implement data caching
- [ ] Create responsive charts

**Guardrails:**
- Charts load within 2 seconds
- Data cached for 24 hours
- Responsive design on all devices
- No broken chart rendering
- Data accuracy validation

**Acceptance Criteria:**
- Charts render correctly
- Data loads quickly
- Responsive design works
- Caching effective

## Phase 5: Security & Compliance (Week 4)

### Task 5.1: Security Implementation
**Objective:** Comprehensive security measures

**Tasks:**
- [ ] Add security headers
- [ ] Implement CSP policies
- [ ] Add rate limiting
- [ ] Create security monitoring

**Guardrails:**
- CSP headers with GTM allowlist
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- HSTS headers for HTTPS
- Rate limiting on API endpoints

**Acceptance Criteria:**
- Security headers present
- CSP properly configured
- Rate limiting active
- Security monitoring working

### Task 5.2: Data Protection
**Objective:** Ensure data privacy and compliance

**Tasks:**
- [ ] Implement data anonymization
- [ ] Add privacy controls
- [ ] Create data retention policies
- [ ] Add compliance monitoring

**Guardrails:**
- No PII in logs or analytics
- API tokens in environment variables only
- Data retention policies enforced
- Privacy controls implemented
- Compliance monitoring active

**Acceptance Criteria:**
- No PII leakage
- Tokens properly secured
- Retention policies followed
- Privacy controls work

## Phase 6: Go-Live Preparation (Week 4)

### Task 6.1: Final Testing & Validation
**Objective:** Comprehensive pre-launch testing

**Tasks:**
- [ ] End-to-end testing
- [ ] Performance testing
- [ ] Security testing
- [ ] User acceptance testing

**Guardrails:**
- All guardrails must pass
- Performance budgets met
- Security requirements satisfied
- No critical issues
- User acceptance criteria met

**Acceptance Criteria:**
- All tests pass
- Performance validated
- Security verified
- Ready for production

### Task 6.2: Deployment & Monitoring
**Objective:** Successful production deployment

**Tasks:**
- [ ] Production deployment
- [ ] Monitoring activation
- [ ] Alert configuration
- [ ] Rollback testing

**Guardrails:**
- 99.9% uptime requirement
- Error rate < 0.1%
- Page load time < 3s for 95% of users
- Build success rate > 95%
- One-click rollback capability

**Acceptance Criteria:**
- Production deployment successful
- Monitoring active
- Alerts configured
- Rollback tested

## Success Metrics

### Performance KPIs
- Build time: < 10 minutes for 10k+ pages
- Page load time: < 3s for 95% of users
- Lighthouse Performance: ≥ 85
- Core Web Vitals: All green

### Quality KPIs
- 0 sitemap validation errors
- 100% of intended URLs present
- SEO score: ≥ 95
- Accessibility score: ≥ 90

### Reliability KPIs
- 99.9% uptime
- Error rate < 0.1%
- Build success rate > 95%
- 0 critical security issues

### Content KPIs
- 100% locale coverage
- All content reviewed and approved
- No stale content (> 30 days)
- 100% image optimization

## Risk Mitigation

### High-Risk Items
1. **Build Performance:** Implement ISR/On-Demand Builders early
2. **CMS Dependencies:** Add comprehensive fallback systems
3. **SEO Quality:** Automated validation and testing
4. **Data Accuracy:** Multi-source validation and monitoring

### Contingency Plans
1. **Build Time Exceeds Limits:** Implement page chunking and parallel builds
2. **CMS Outage:** Static fallback content and cached data
3. **Performance Issues:** Progressive optimization and monitoring
4. **Security Issues:** Immediate rollback and security audit

## Maintenance & Updates

### Ongoing Tasks
- Daily ETL monitoring
- Weekly performance reviews
- Monthly security audits
- Quarterly content reviews

### Update Procedures
- Feature updates: Staged rollout with monitoring
- Security updates: Immediate deployment with rollback plan
- Content updates: CMS-driven with validation
- Performance updates: A/B testing before full rollout
