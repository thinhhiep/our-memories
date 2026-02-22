# 🤝 Contributing to Our Memories

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/our-memories.git
   cd our-memories
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/thinhhiep/our-memories.git
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Setup development environment**
   ```bash
   npm install
   cp .env.example .env.local
   # Edit .env.local with your database credentials
   npm run init-db
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Making Changes

1. **Create feature branch from master**
   ```bash
   git checkout master
   git pull upstream master
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Keep commits atomic and logical
   - Write clear commit messages
   - Follow the existing code style

3. **Test your changes**
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: describe your feature"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Go to GitHub and create PR
   - Describe what you changed and why
   - Link related issues

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body

footer
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Dependencies, build config, etc.

### Examples
```
feat(albums): add search functionality
fix(api): handle null cover image gracefully
docs(setup): clarify database setup steps
refactor(timeline): optimize timeline rendering
```

## Code Style

### TypeScript
- Use strict mode
- Provide explicit types where possible
- Avoid `any` type
- Use interfaces for object shapes

### React
- Use functional components with hooks
- Keep components small and focused
- Use meaningful component names
- Add JSDoc comments for complex logic

### File Organization
```
components/
├── ui/              # Shadcn/ui components
├── feature/         # Feature-specific components
└── layout/          # Layout components

hooks/
├── use-feature.ts   # Feature hooks

lib/
├── utils.ts         # Utility functions
├── types.ts         # TypeScript types
└── data.ts          # Data helpers

app/
├── api/            # API routes
├── feature/        # Feature pages
└── layout.tsx      # Root layout
```

### Naming Conventions
- Components: PascalCase (`UserProfile.tsx`)
- Functions: camelCase (`getUserData()`)
- Constants: UPPER_SNAKE_CASE (`MAX_ITEMS = 10`)
- Files: kebab-case with appropriate extensions
  - Components: `.tsx`
  - Utilities: `.ts`
  - Styles: `.css`

## Testing

### Running Tests
```bash
npm test
```

### Writing Tests
- Create `__tests__` directory in same folder
- Name test files: `component.test.tsx`
- Use meaningful test descriptions
- Test behavior, not implementation

### Example
```typescript
import { render, screen } from '@testing-library/react'
import { UserProfile } from './user-profile'

describe('UserProfile', () => {
  it('displays user name', () => {
    render(<UserProfile userId="123" />)
    expect(screen.getByText(/john/i)).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<UserProfile userId="123" loading />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
})
```

## Documentation

### Code Comments
```typescript
// Use JSDoc for public functions
/**
 * Fetches user albums and builds timeline groups
 * @param userId - User identifier
 * @param options - Optional filtering options
 * @returns Timeline groups organized by year/month
 */
export function useSubalbums(
  userId: string,
  options?: FilterOptions
) {
  // implementation
}
```

### README
- Update README.md if adding major features
- Keep it concise and up-to-date
- Add examples for new functionality

### API Documentation
- Update API.md for new endpoints
- Include request/response examples
- Document error cases
- Add curl examples

## Pull Request Process

1. **Ensure tests pass**
   ```bash
   npm run lint
   npm run build
   ```

2. **Self-review your code**
   - Check for style consistency
   - Verify no console errors
   - Test edge cases

3. **Create descriptive PR**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Breaking change

   ## Testing
   How to test the changes

   ## Checklist
   - [ ] Code follows style guide
   - [ ] Comments added for complex logic
   - [ ] Documentation updated
   - [ ] No breaking changes
   - [ ] Tests added/updated
   ```

4. **Address review feedback**
   - Respond to comments
   - Make requested changes
   - Push updates to same branch

5. **Wait for approval**
   - At least one approval required
   - CI checks must pass
   - Then merge!

## Feature Development

### Large Features

For significant features, create a **Feature Request** issue first:

1. Create issue describing the feature
2. Discuss design and approach
3. Get approval from maintainers
4. Implement following the plan
5. Create PR when ready

### Feature Checklist

- [ ] Feature implemented
- [ ] Tests written
- [ ] TypeScript types added
- [ ] Components documented
- [ ] API endpoints working
- [ ] Error handling added
- [ ] Loading states handled
- [ ] Mobile responsive
- [ ] Accessibility considered
- [ ] Documentation updated

## Debugging

### Dev Tools

```javascript
// React DevTools Chrome Extension
// Redux DevTools (if applicable)
// Network tab for API debugging
```

### Common Issues

**Issue: Types not working**
```bash
# Rebuild TypeScript
npm run build
```

**Issue: Database connection**
```bash
# Check .env.local
# Verify DATABASE_URL is set
npm run init-db
```

**Issue: Hot reload not working**
```bash
# Kill dev server and restart
npm run dev
```

## Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the issue

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Safari
- Version: 1.0.0
```

## Feature Requests

```markdown
**Is your feature related to a problem?**
Clear description

**Describe the solution**
How you'd like it implemented

**Alternative Approaches**
Other ways to solve this

**Additional Context**
Any other info
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com/)

## Questions?

- Create a [discussion](https://github.com/thinhhiep/our-memories/discussions)
- Email the maintainer
- Check existing issues and PRs

## Recognition

Contributors will be recognized in:
- README.md contributors section
- GitHub contributors page
- Release notes

Thank you for contributing! 🎉
