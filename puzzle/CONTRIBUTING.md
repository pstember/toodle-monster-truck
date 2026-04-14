# Contributing to Photo Puzzle

Thanks for contributing! Guidelines below.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Git

### Local Setup

1. Clone repo:
```bash
git clone https://github.com/yourusername/toddler-games.git
cd toddler-games/puzzle
```

2. Install deps:
```bash
npm install
```

3. Run dev server:
```bash
npm run dev
```

## Code Style Guide

### Immutability (CRITICAL)
Create new objects, never mutate:

```javascript
// ❌ Wrong: mutates existing object
state.tray.push(pieceId);

// ✅ Correct: creates new object
const updatedState = {
  ...state,
  tray: [...state.tray, pieceId]
};
```

```javascript
// ❌ Wrong: mutates array
pieces.splice(index, 1);

// ✅ Correct: creates new array
const updatedPieces = pieces.filter((_, i) => i !== index);
```

### File Size Limits
- **Functions**: Maximum 50 lines
- **Files**: Target 200-400 lines, maximum 800 lines
- File exceeds limits → extract utilities or split by domain

### Error Handling
- Add try-catch for DOM ops
- Null check before element access
- Validate image load and Canvas ops

```javascript
// ✅ Good error handling
async function loadImage(url) {
    try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
        });
        return img;
    } catch (error) {
        console.error('Failed to load image:', error);
        throw new Error('Image loading failed');
    }
}
```

### No Hardcoded Values
Extract magic numbers to constants:

```javascript
// ❌ Wrong
const hintDelay = 5000;

// ✅ Correct
const HINT_DELAY_MS = 5000;
```

## Testing Requirements

### Test Coverage
- **Minimum coverage**: 80% for lines, functions, and branches
- Run coverage check: `npm run test:coverage`

### Test Types Required
1. **Unit Tests** (Vitest): Individual functions, game logic, geometry calculations
2. **E2E Tests** (Playwright): Critical user flows

### Running Tests

```bash
# Run all unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:headed

# Generate coverage report
npm run test:coverage
```

### Writing Tests
- Unit tests in `src/*.test.js` files (e.g., `puzzle-logic.test.js`)
- E2E tests in `e2e/` directory
- Descriptive test names: `test('should place piece in correct slot', ...)`
- Test success and failure cases
- Geometry tests: verify math correctness

### Test-Driven Development (TDD)
1. Write test first (RED)
2. Run test - should FAIL
3. Write minimal implementation (GREEN)
4. Run test - should PASS
5. Refactor (IMPROVE)
6. Verify coverage >= 80%

## Pull Request Process

### Before Submitting
1. ✅ All tests passing: `npm test`
2. ✅ E2E tests passing: `npm run test:e2e`
3. ✅ Coverage >= 80%: `npm run test:coverage`
4. ✅ No console.log statements (except error logging)
5. ✅ Code follows style guide
6. ✅ New functions have tests
7. ✅ Large functions split (<50 lines)
8. ✅ No hardcoded magic numbers

### PR Checklist
- [ ] Tests added for new functionality
- [ ] Existing tests pass
- [ ] Coverage maintained at 80%+
- [ ] Code follows immutability principles
- [ ] No console.log statements
- [ ] Error handling added where needed
- [ ] ARIA labels added for new interactive elements
- [ ] README updated if needed

### Commit Message Format

```
<type>: <description>

<optional body>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `test`: Test additions/fixes
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Examples:**
```
feat: add custom tongue parameter controls

fix: resolve piece clipping issue at board edges

refactor: extract Voronoi logic to separate module

test: add tests for NURBS tongue curve generation
```

### PR Title
Same format as commits:
- `feat: add image upload functionality`
- `fix: hint timer not starting correctly`

### PR Description Template
```markdown
## Summary
Brief description of changes

## Changes
- Bullet list of specific changes

## Test Plan
- [ ] Manual testing on Chrome/Firefox/Safari
- [ ] All automated tests pass
- [ ] Coverage remains >= 80%
- [ ] Tested with various image sizes

## Screenshots (if applicable)
[Add screenshots for UI changes]
```

## Code Review Standards

PRs must pass review before merge:
- No CRITICAL or HIGH severity issues
- Code quality checklist passed
- Tests adequate and passing
- Performance acceptable

## Development Workflow

1. **Plan First**
   - Complex features → create issue first
   - Discuss before implementing

2. **TDD Approach**
   - Write tests before implementation
   - Tests fail → implement
   - Refactor with test safety net

3. **Code Review**
   - Address CRITICAL/HIGH issues
   - Fix MEDIUM when possible

4. **Commit & Push**
   - Follow commit message format
   - Group related changes

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/toddler-games/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/toddler-games/discussions)

## License

Contributing = agree to ISC License.