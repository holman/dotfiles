---
description: Quick editorial pass for grammar, style, and final polish before publication
agent: content-editor
model: anthropic/claude-3-5-sonnet-20241022
---

Fast, focused editorial pass for final polish - grammar, style, and publication readiness.

## Purpose

Quick quality check before publication focusing on:
- Grammar, punctuation, and spelling
- Style consistency and formatting
- Readability and flow
- Final polish and presentation

**Best for:** Content that's already in good shape but needs final review before going live.

## What Gets Checked

### Grammar & Mechanics
- Spelling errors and typos
- Punctuation correctness
- Subject-verb agreement
- Pronoun consistency
- Verb tense consistency
- Common grammar mistakes

### Style & Consistency
- Style guide compliance (AP, Chicago, etc.)
- Terminology consistency
- Capitalization rules
- Number formatting
- Date and time formatting
- Abbreviation and acronym usage

### Formatting & Presentation
- Heading hierarchy (H1, H2, H3, etc.)
- Bullet point and list formatting
- Link formatting and functionality
- Code block formatting (if applicable)
- Image alt text (if applicable)
- Table formatting and alignment

### Readability Quick Checks
- Sentence length variety
- Paragraph breaks and white space
- Active vs passive voice
- Transition words and flow
- Clarity of opening and closing

### Final Polish
- Remove redundancies
- Tighten wordiness
- Improve word choice
- Enhance flow with better transitions
- Strengthen weak phrases

## What Gets Skipped (Use /edit for these)

/polish does NOT provide:
- ❌ Structural reorganization
- ❌ Major tone or voice changes
- ❌ Content strategy recommendations
- ❌ Deep SEO optimization
- ❌ Comprehensive accessibility review
- ❌ Audience analysis
- ❌ Fact-checking or research
- ❌ Complete rewrites

## Deliverables

You will receive:

### Quick Assessment
- **Publication Ready**: Yes/No/With minor fixes
- **Critical Issues**: Must-fix items blocking publication
- **Quick Wins**: Easy improvements for polish

### Focused Feedback
- Grammar and spelling corrections
- Style inconsistencies
- Formatting issues
- Readability improvements
- Final polish suggestions

### Clean Copy (Optional)
- Corrected version with all fixes applied
- Track changes showing modifications
- Ready for immediate publication

## Speed vs Depth

| Command | Speed | Depth | Best For |
|---------|-------|-------|----------|
| `/polish` | Fast (minutes) | Surface-level | Final pass, grammar check |
| `/edit` | Medium (15-30min) | Comprehensive | Content improvement |
| `/edit --deep` | Slow (30-60min) | Exhaustive | Major revision, strategy |

## Usage Examples

```bash
# Quick polish before publishing
/polish blog-post-final-draft.md

# Grammar check on documentation
/polish docs/api-reference.md

# Final review of README
/polish README.md

# Style check on release notes
/polish CHANGELOG.md

# Quick pass on email template
/polish templates/newsletter.html

# Polish social media post
/polish social/product-launch-announcement.txt

# Final check on landing page copy
/polish marketing/homepage-copy.md
```

## When to Use /polish

**Perfect for:**
- ✅ Final review before publication
- ✅ Grammar and typo check
- ✅ Style consistency validation
- ✅ Quick formatting cleanup
- ✅ Last-minute polish
- ✅ Time-sensitive content
- ✅ Content you're confident about

**Not ideal for:**
- ❌ First drafts needing structure
- ❌ Content requiring major revision
- ❌ Unclear or confusing writing
- ❌ Audience mismatch issues
- ❌ Strategic content changes
- ❌ SEO optimization needs
- ❌ Accessibility compliance review

## Command Modifiers

### `--strict`
Apply style guide rules strictly, flag all deviations
```bash
/polish --strict formal-document.md
```

### `--permissive`
Allow stylistic flexibility, focus on errors only
```bash
/polish --permissive creative-blog-post.md
```

### `--style [guide]`
Use specific style guide (AP, Chicago, APA, MLA)
```bash
/polish --style AP news-article.md
/polish --style Chicago research-paper.md
```

### `--fix`
Automatically apply all fixes and return clean copy
```bash
/polish --fix draft.md
```

## Output Format

### Standard Output
```
**Polish Assessment**: [Publication Ready / Minor Fixes Needed / Needs /edit]

**Critical Issues** (Must Fix):
- [Issue with location and fix]

**Style & Grammar** (Should Fix):
- Line 12: "it's" → "its" (possessive)
- Line 23: Inconsistent heading capitalization
- Line 45: Passive voice - consider active alternative

**Quick Wins**:
- Remove redundant phrases in paragraph 3
- Tighten wordy sentence in paragraph 7
- Add transition between sections 2 and 3

**Readability**:
- 3 sentences over 30 words - consider breaking up
- Good variety of sentence lengths overall
- Strong opening and closing

**Publication Status**: ✅ Ready after fixes / ⚠️ Review critical issues
```

### With `--fix` Modifier
```
**Clean Copy Generated** ✅

Applied fixes:
- Corrected 8 spelling/typo errors
- Fixed 12 punctuation issues
- Standardized 5 style inconsistencies
- Improved 3 readability issues

[Clean copy provided below or in new file]
```

## Integration with Editorial Workflow

### Typical Content Workflow
```
Draft → /edit (comprehensive review) → Revisions → /polish (final pass) → Publish
```

### Quick Content Workflow
```
Draft → /polish (if already good) → Publish
```

### Emergency/Fast Content
```
Draft → /polish --fix (auto-apply fixes) → Publish immediately
```

## Quality Standards

/polish ensures:
- ✅ Zero spelling or grammar errors
- ✅ Consistent style throughout
- ✅ Proper formatting and structure
- ✅ Good readability and flow
- ✅ Professional presentation
- ✅ Publication-ready polish

/polish does NOT guarantee:
- ❌ Optimal content strategy
- ❌ Maximum engagement
- ❌ SEO optimization
- ❌ Accessibility compliance
- ❌ Tone perfection
- ❌ Structural excellence

## Speed Estimates

- **Short content** (< 500 words): 30 seconds
- **Medium content** (500-1500 words): 1-2 minutes
- **Long content** (1500-3000 words): 2-5 minutes
- **Very long content** (> 3000 words): 5-10 minutes

Compare to `/edit`:
- Short: 5-10 minutes
- Medium: 15-30 minutes
- Long: 30-60 minutes

## Best Practices

**Use /polish when:**
- Content is already in good shape
- You're confident about structure and tone
- Just need a final quality check
- Time is limited before publication
- Grammar and style are the main concerns

**Use /edit when:**
- First time review of content
- Major changes might be needed
- Unclear if content is effective
- Want strategic recommendations
- Need comprehensive feedback
- Audience or tone adjustments needed

**Sequence them:**
```bash
# First pass - comprehensive
/edit draft.md

# Make revisions based on feedback

# Final pass - quick polish
/polish draft-revised.md
```

## Pro Tips

1. **Always /polish before publishing** - Catch those last typos
2. **Don't /polish too early** - Fix big issues with /edit first
3. **Use --fix for speed** - When you trust the automated corrections
4. **Combine with /review** - For code + content quality
5. **Set up as pre-commit hook** - Auto-polish before commits

---

Think of /polish as your final quality gate - the last check before your content goes out into the world. Fast, focused, and publication-ready.
