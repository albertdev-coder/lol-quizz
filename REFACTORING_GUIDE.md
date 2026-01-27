# /src/lib Refactoring - Migration Guide

## 📋 Overview

The `/src/lib` directory has been reorganized to properly separate server-only, client-only, and shared utility code according to Next.js App Router best practices. This refactoring eliminates server/client contamination and prevents unintended prerendering issues.

---

## 🏗️ New Structure

### **Server-Only Modules**

These files can ONLY be imported in Server Components and API routes:

#### **`quiz-server.ts`**
- Imports static JSON data
- Contains: `getAllQuestions()`, `getQuestionsByLevel()`, `getRandomQuestions()`
- Marked with: `import 'server-only'`
- **⚠️ DO NOT import in client components**

#### **`db.ts`**
- Database operations using better-sqlite3
- Contains: `getQuestions()`, `getQuestionById()`, `saveResult()`, `getResults()`
- Marked with: `import 'server-only'`
- **⚠️ DO NOT import in client components**

#### **`server-utils.ts`**
- Server-side utilities (bcrypt, crypto)
- Contains: `hashString()`, `verifyHashString()`, `pbkdf2Hash()`, etc.
- Marked with: `import 'server-only'`
- **⚠️ DO NOT import in client components**

#### **`user-register.ts`**
- User registration callback (placeholder)
- Contains: `userRegisterCallback()`
- Marked with: `import 'server-only'`
- **⚠️ DO NOT import in client components**

---

### **Client-Only Modules**

These files can ONLY be imported in Client Components:

#### **`quiz-client.ts`**
- Browser fetch operations
- Contains: `fetchQuestionsFromAPI()`, `saveQuizResults()`, `fetchQuizResults()`
- Marked with: `'use client'`
- Uses browser APIs: `fetch()`, `window`
- **⚠️ DO NOT import in server components**

#### **`api-client.ts`**
- Generic API client with auth support
- Contains: `api.get()`, `api.post()`, `api.put()`, `api.delete()`
- Marked with: `'use client'`
- Uses browser APIs: `fetch()`, `window.location`
- **⚠️ DO NOT import in server components**

---

### **Shared Pure Utilities**

These files can be imported in BOTH client and server:

#### **`quiz-utils.ts`**
- Pure utility functions for quiz logic
- Contains:
  - `shuffleArray()` - Shuffle algorithm
  - `calculateScore()` - Score calculation
  - `formatTime()` - Time formatting
  - `getLevelColor()` - Level color mapping
  - `getLevelEmoji()` - Level emoji mapping
  - `getScoreMessage()` - Score message generator
  - `getLevelName()` - Level name getter
  - `getLevelDescription()` - Level description getter
- **✅ Safe for both client and server**
- No imports, no side effects, pure functions only

#### **`utils.ts`**
- Generic utility functions
- Contains: `cn()` - Tailwind class merger
- **✅ Safe for both client and server**

---

## 🔄 Migration Changes

### **Files Modified**

1. **`/src/hooks/useQuiz.ts`**
   - Changed: Import `fetchQuestionsFromAPI` from `@/lib/quiz-client` (was `@/lib/quiz-utils`)
   - Changed: Import `calculateScore` from `@/lib/quiz-utils` (no change)
   - Added: Save questions to localStorage for results page

2. **`/src/app/results/page.tsx`**
   - Removed: Import of `getAllQuestions` from `@/lib/quiz-utils`
   - Removed: Import of `saveQuizResults` from `@/lib/quiz-utils`
   - Added: Import `saveQuizResults` from `@/lib/quiz-client`
   - Changed: Now reads questions from localStorage instead of calling `getAllQuestions()`

3. **`/src/lib/quiz-utils.ts`** (completely rewritten)
   - Removed: All JSON imports
   - Removed: All fetch operations
   - Removed: All browser-dependent code
   - Kept: Only pure utility functions

4. **`/src/lib/quiz-server.ts`** (NEW FILE)
   - Created: Server-only module for static JSON operations
   - Moved: `getAllQuestions()`, `getQuestionsByLevel()` from old quiz-utils
   - Added: `getRandomQuestions()` helper

5. **`/src/lib/quiz-client.ts`** (NEW FILE)
   - Created: Client-only module for browser fetch operations
   - Moved: `fetchQuestionsFromAPI()`, `saveQuizResults()` from old quiz-utils
   - Added: `fetchQuizResults()` helper

6. **`/src/lib/api-client.ts`**
   - Added: `'use client'` directive (was missing)

7. **`/src/lib/server-utils.ts`**
   - Added: `import 'server-only'`
   - Added: Documentation comments

8. **`/src/lib/db.ts`**
   - Added: `import 'server-only'`
   - Added: Documentation comments

9. **`/src/lib/user-register.ts`**
   - Added: `import 'server-only'`
   - Added: Documentation comments

10. **`/src/lib/utils.ts`**
    - Added: Better documentation comment

---

## ✅ Verification Checklist

### **Before Deploying**

- [ ] Run `pnpm build` - should complete without errors
- [ ] Check for any `import 'server-only'` errors in browser console
- [ ] Check for any `'use client'` contamination warnings
- [ ] Test quiz flow: home → quiz → results
- [ ] Test question loading from API
- [ ] Test results saving to API
- [ ] Test localStorage persistence
- [ ] Verify no prerendering errors for `/quiz` route

### **File Import Rules**

**✅ CORRECT:**
```typescript
// In client component
import { fetchQuestionsFromAPI } from '@/lib/quiz-client'
import { calculateScore } from '@/lib/quiz-utils'

// In server component / API route
import { getAllQuestions } from '@/lib/quiz-server'
import { getQuestions } from '@/lib/db'
```

**❌ INCORRECT:**
```typescript
// In client component - WRONG!
import { getAllQuestions } from '@/lib/quiz-server'

// In server component - WRONG!
import { fetchQuestionsFromAPI } from '@/lib/quiz-client'
```

---

## 🔍 Key Benefits

1. **No More Prerendering Issues**: Client components no longer import server modules
2. **Clear Separation**: Server/client boundaries are explicit and enforced
3. **Better Performance**: No unnecessary code shipped to client
4. **Type Safety**: TypeScript will catch incorrect cross-boundary imports
5. **Maintainability**: Clear file organization makes it obvious where code belongs

---

## 📝 Notes

- All existing functionality has been preserved
- No breaking changes to API endpoints
- No changes to database schema
- JSON data files remain in `/data` directory
- SQLite database remains the primary data source for API routes

---

## 🚨 Common Errors & Solutions

### Error: "Module not found: Can't resolve '@/lib/quiz-utils'"
**Solution:** You're importing a function that was moved. Check the migration guide above.

### Error: "You're importing a component that needs 'server-only'"
**Solution:** You're trying to import a server module in a client component. Use `@/lib/quiz-client` instead.

### Error: "'use client' is required"
**Solution:** You're trying to use browser APIs in a server module. Move code to `@/lib/quiz-client`.

---

## 📚 Additional Resources

- [Next.js: Server and Client Composition Patterns](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- [Server-only package documentation](https://www.npmjs.com/package/server-only)
- [Client Components documentation](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
