# Letter of Recommendation Generator

A modern web application built with Next.js that helps generate professional letters of recommendation with a beautiful and user-friendly interface.

## Features

- 📝 Interactive form for entering recommendation details
- 🖼️ Company logo, signature, and stamp upload capabilities
- 📄 Real-time preview of the recommendation letter
- 🎨 Professional formatting and layout
- 📱 Responsive design for all devices
- 🌙 Dark mode support
- 📥 PDF export functionality

## Tech Stack

- **Framework**: Next.js 15.2
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **PDF Generation**: PDF-lib
- **Date Handling**: date-fns
- **Type Safety**: TypeScript
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd Letter-of-Recomendation
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
npm run start
# or
pnpm build
pnpm start
```

## Project Structure

- `/app` - Next.js app router files
- `/components` - React components
  - `/ui` - Reusable UI components
  - `form.tsx` - Main form component
  - `preview.tsx` - Letter preview component
  - `pdf-generator.tsx` - PDF generation logic
- `/lib` - Utility functions
- `/types` - TypeScript type definitions
- `/public` - Static assets
- `/styles` - Global styles

## Features in Detail

### Form Component
- Input fields for all necessary recommendation letter details
- File upload for company logo, signature, and stamp
- Form validation and error handling
- Responsive layout

### Preview Component
- Real-time preview of the letter
- Professional formatting
- Company branding integration
- Signature and stamp placement

### PDF Generation
- High-quality PDF output
- Maintains formatting and layout
- Includes all uploaded images
- Professional document structure

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 