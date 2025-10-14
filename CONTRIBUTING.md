# Contributing to BharatNet CRM

First off, thank you for considering contributing to BharatNet CRM! 🎉

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**

- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Node Version: [e.g. 18.17.0]
- MongoDB Version: [e.g. 6.0]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- Use a clear and descriptive title
- Provide a detailed description of the suggested enhancement
- Explain why this enhancement would be useful
- Include mockups or examples if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test thoroughly** - ensure all tests pass
4. **Update documentation** if needed
5. **Commit with clear messages** following our commit guidelines
6. **Push to your fork** and submit a pull request

## 📝 Development Process

### Setting Up Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/crm-end-to-end.git
cd crm-end-to-end

# Add upstream remote
git remote add upstream https://github.com/ayeendroid/crm-end-to-end.git

# Install dependencies
npm install

# Create a branch for your feature
git checkout -b feature/amazing-feature

# Start development servers
npm run dev
```

### Coding Standards

#### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint rules (run `npm run lint`)
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused (single responsibility)

#### React Components

- Use functional components with hooks
- Keep components pure when possible
- Extract reusable logic into custom hooks
- Use proper TypeScript types/interfaces

**Example:**

```typescript
interface CustomerCardProps {
  customer: Customer;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onEdit,
  onDelete,
}) => {
  // Component implementation
};
```

#### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Keep custom CSS minimal
- Use CSS variables for theme colors

### Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat(dashboard): add revenue trend chart
fix(auth): resolve token expiration issue
docs(readme): update installation instructions
refactor(api): simplify customer controller logic
test(customer): add unit tests for CRUD operations
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Test Requirements:**

- Write unit tests for utility functions
- Write integration tests for API endpoints
- Write component tests for React components
- Maintain test coverage above 80%

### Code Review Process

1. **Automated Checks**: CI/CD will run tests and linting
2. **Manual Review**: Maintainers will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged

**What We Look For:**

- ✅ Code quality and readability
- ✅ Proper error handling
- ✅ Test coverage
- ✅ Documentation updates
- ✅ No breaking changes (or properly documented)
- ✅ Performance considerations

## 🎨 Style Guide

### File Naming

- **Components**: PascalCase - `CustomerCard.tsx`
- **Utilities**: camelCase - `formatDate.ts`
- **Types**: PascalCase - `Customer.ts`
- **Tests**: Same as file + `.test` - `CustomerCard.test.tsx`

### Folder Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── features/        # Feature-specific components
│   └── layout/          # Layout components
├── hooks/               # Custom React hooks
├── services/            # API services
├── types/               # TypeScript types
├── utils/               # Utility functions
└── pages/               # Page components
```

### Import Order

1. External packages (React, etc.)
2. Internal modules (components, utils)
3. Types/Interfaces
4. Styles

```typescript
// External
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Internal
import { Button } from "@/components/common";
import { formatDate } from "@/utils";

// Types
import type { Customer } from "@/types";

// Styles
import "./CustomerCard.css";
```

## 🐛 Debugging Tips

### Frontend Debugging

```bash
# Enable React DevTools
# Install: https://react.dev/learn/react-developer-tools

# Enable Redux DevTools (if using Redux)
# Browser extension required
```

### Backend Debugging

```bash
# Enable debug mode
NODE_ENV=development npm run dev:server

# Use VS Code debugger
# .vscode/launch.json configured
```

### MongoDB Debugging

```bash
# Connect to MongoDB shell
mongosh

# Check database
use bharatnet-crm
db.customers.find().pretty()
```

## 📚 Resources

### Documentation

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Project-Specific Guides

- [Architecture Overview](./docs/ARCHITECTURE.md) (coming soon)
- [API Documentation](./docs/API.md) (coming soon)
- [Database Schema](./docs/DATABASE.md) (coming soon)

## 🏆 Recognition

Contributors who make significant contributions will be:

- Listed in [CONTRIBUTORS.md](./CONTRIBUTORS.md)
- Mentioned in release notes
- Given credit in documentation

## 💬 Communication

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Request Comments**: Code-specific discussions

## ❓ Questions?

Don't hesitate to ask questions! We're here to help:

- Open an issue with the `question` label
- Start a discussion in GitHub Discussions
- Reach out to maintainers

---

**Thank you for contributing to BharatNet CRM! 🙏**

Together, we're building something amazing! 🚀
