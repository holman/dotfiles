---
description: Editorial review and content refinement for clarity, engagement, and quality
agent: content-editor
model: anthropic/claude-3-5-sonnet-20241022
---

Review and refine existing content for clarity, engagement, quality, and effectiveness.

## Content Assessment

The Content Editor will provide comprehensive editorial review:

### Structure & Organization
- Opening effectiveness and hook strength
- Logical flow and transitions
- Information hierarchy and scanability
- Heading structure and navigation
- Conclusion and call-to-action clarity

### Clarity & Readability
- Reading level appropriateness for audience
- Sentence complexity and variety
- Paragraph length and white space
- Jargon and terminology usage
- Plain language principles
- Readability scores (Flesch-Kincaid, Gunning Fog)

### Tone & Voice
- Brand alignment and consistency
- Audience appropriateness
- Voice consistency throughout
- Personality and engagement level
- Professional vs conversational balance

### Engagement & Impact
- Hook effectiveness
- Value proposition clarity
- Call-to-action strength
- Emotional resonance
- Persuasiveness and conviction

### Technical Quality
- Grammar, punctuation, spelling
- Style consistency (AP, Chicago, etc.)
- Formatting and presentation
- Citation and reference accuracy
- Fact-checking and verification

### Accessibility & Inclusivity
- Inclusive language (gender-neutral, culturally sensitive)
- Plain language and simplicity
- Screen reader compatibility
- Reading level match with audience
- Alternative text and descriptions

### SEO & Discoverability (when applicable)
- Keyword integration and natural placement
- Meta descriptions and titles
- Header structure (H1-H6 hierarchy)
- Internal and external linking
- Featured snippet optimization

## Content Types Supported

- **Technical Documentation**: API docs, user guides, tutorials
- **Marketing Content**: Landing pages, blog posts, email campaigns
- **Product Content**: README files, release notes, changelogs
- **User Interface**: Error messages, tooltips, microcopy
- **Social Media**: Posts, captions, announcements
- **Internal Docs**: Wiki pages, process docs, runbooks
- **Educational**: Tutorials, how-to guides, courses
- **Creative**: Blog posts, case studies, stories

## Deliverables

You will receive:

### Overall Assessment
- Quality rating (Excellent/Good/Needs Improvement/Major Revision)
- Quick summary of strengths and issues
- Priority issues categorized by severity

### Detailed Feedback
- **Critical Issues** (🔴): Significantly impact comprehension or credibility
- **Important Issues** (🟡): Should be addressed for quality
- **Minor Suggestions** (🟢): Polish and refinement opportunities

### Line-by-Line Edits
- Specific passages that need improvement
- Clear explanation of what's wrong and why
- Concrete suggestions with before/after examples

### Quick Wins
- Simple changes with high impact
- Easy improvements for immediate quality boost
- Low-effort polish opportunities

### Strategic Improvements
- Larger structural or conceptual changes
- Tone or voice adjustments
- Content additions or cuts
- Organizational recommendations

### Revised Content (optional)
- Can provide fully edited version if requested
- Track changes showing all modifications
- Explanation of major changes

## Assessment Areas

### Priority 1 (Must Fix)
- Factual errors or inaccuracies
- Confusing or unclear passages
- Broken logic or flow
- Grammatical errors that affect meaning
- Accessibility barriers
- Brand voice violations

### Priority 2 (Should Fix)
- Passive voice overuse
- Redundancy or wordiness
- Weak headlines or hooks
- Inconsistent terminology
- Missing or weak CTAs
- Style guide deviations

### Priority 3 (Consider)
- Sentence variety enhancement
- Word choice refinement
- Rhythm and pacing improvements
- Additional examples or analogies
- Visual content opportunities

## Usage Examples

```bash
# Review documentation
/edit docs/getting-started.md

# Polish blog post
/edit content/blog/new-feature-announcement.md

# Improve README
/edit README.md

# Refine marketing copy
/edit landing-page-copy.txt

# Review error messages
/edit src/components/ErrorBoundary.tsx

# Edit release notes
/edit CHANGELOG.md

# Improve UI microcopy
/edit src/locales/en/messages.json

# Review email template
/edit templates/welcome-email.html
```

## Command Modifiers

### `--quick`
Fast editorial pass focusing on critical issues only
```bash
/edit --quick draft-blog-post.md
```

### `--deep`
Comprehensive review including SEO, accessibility, and strategic improvements
```bash
/edit --deep marketing/landing-page.md
```

### `--tone [style]`
Adjust tone for specific audience or platform
```bash
/edit --tone professional formal-report.md
/edit --tone friendly user-guide.md
/edit --tone technical api-docs.md
```

### `--audience [level]`
Target specific audience expertise level
```bash
/edit --audience beginner getting-started.md
/edit --audience expert advanced-guide.md
```

### `--format [type]`
Optimize for specific content format
```bash
/edit --format blog blog-post.md
/edit --format docs technical-guide.md
/edit --format social twitter-thread.txt
```

### `--revise`
Provide fully edited version with tracked changes
```bash
/edit --revise product-description.md
```

## Integration with Other Agents

Content Editor collaborates with:
- **Documentation Specialist**: Reviews and refines generated documentation
- **Frontend Engineer**: Improves UI copy and error messages
- **Backend Architect**: Clarifies API documentation and error responses
- **Mobile Engineer**: Enhances app store descriptions and in-app messaging
- **Security Auditor**: Ensures security messaging is clear but not overly technical
- **Accessibility Engineer**: Validates inclusive language and readability

## When to Use /edit vs Other Commands

**Use /edit when:**
- You have existing content that needs improvement
- Content is drafted but needs polish
- You want to optimize for clarity and engagement
- Grammar and style review needed
- Ensuring brand voice consistency

**Use /document when:**
- Creating new documentation from code
- Need technical content written from scratch
- Generating API references or user guides

**Use /polish when:**
- Final pass before publication
- Quick grammar and style check only
- No structural changes needed

**Use /improve when:**
- Want suggestions for code improvements (not content)
- Technical implementation refinement

## Output Format

Content Editor provides:
1. **Executive summary** of content quality
2. **Priority-sorted feedback** (Critical → Important → Minor)
3. **Specific line-by-line suggestions** with examples
4. **Quick wins** for immediate improvement
5. **Strategic recommendations** for bigger changes
6. **Readiness assessment** for publication

## Best Practices

The Content Editor ensures:
- ✅ Clarity and comprehension for target audience
- ✅ Consistent tone and brand voice
- ✅ Proper grammar, punctuation, and spelling
- ✅ Engaging and scannable structure
- ✅ Accessible and inclusive language
- ✅ SEO optimization (when applicable)
- ✅ Clear calls-to-action
- ✅ Factual accuracy and credibility

---

Transform good content into great content. Every word should serve your audience and achieve your goals.
