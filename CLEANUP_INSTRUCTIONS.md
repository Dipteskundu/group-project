# Final Cleanup Instructions - Remove Remaining Dark Mode Classes

## Summary
The Home page and Footer have been cleaned. The Edit Profile page still contains dark mode classes that need to be removed.

## Completed ✅
1. **Home Page** - All dark mode classes removed
2. **Footer** - All dark mode classes removed  
3. **Navbar** - All dark mode classes and theme toggle removed
4. **Tailwind Config** - Dark mode disabled
5. **Layout** - Theme script removed
6. **Providers** - ThemeProvider removed

## Remaining Work - Edit Profile Page

The file `SkillMatch-AI/src/app/profile/edit/page.jsx` contains many `dark:` classes that need to be removed.

### Pattern to Remove:
Replace all instances of `dark:*` classes with nothing (empty string).

### Common Patterns in Edit Profile:
- `dark:bg-slate-*` → remove
- `dark:border-slate-*` → remove
- `dark:text-slate-*` → remove
- `dark:hover:bg-*` → remove
- `dark:focus:ring-*` → remove
- `dark:placeholder:text-*` → remove

### Manual Cleanup Needed:
Search for "dark:" in the file and remove all occurrences.

## Quick Fix Command (if using VS Code):
1. Open `SkillMatch-AI/src/app/profile/edit/page.jsx`
2. Press Ctrl+H (Find and Replace)
3. Enable Regex mode
4. Find: `\s*dark:[^\s"]+`
5. Replace with: (empty)
6. Replace All

This will remove all dark mode classes from the file.

---
**Status**: Almost Complete - Just Edit Profile page needs cleanup
**Date**: March 9, 2026
