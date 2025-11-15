# Quiz Builder - OCR AI

An intelligent quiz extraction application that uses Google's Gemini AI to extract multiple-choice questions from images. Perfect for digitizing paper-based quiz sheets into editable, copyable text format.

## Features

- 📸 **Image Upload**: Upload images of quiz sheets (supports JPEG, PNG)
- 🤖 **AI-Powered OCR**: Utilizes Google Gemini 2.5 Flash for accurate text extraction
- 🌐 **Multilingual Support**: Preserves original language (English, Bengali, etc.)
- ✏️ **Editable Results**: Edit extracted questions and options
- 📋 **Copy to Clipboard**: Quick copy functionality for all questions
- 🎨 **Modern UI**: Clean, responsive design with dark mode support

## Project Structure

```
quiz-builder/
├── quiz-builder-ocr-ai/          # Main application
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── services/             # API services
│   │   └── types.ts              # TypeScript types
│   ├── api/                      # Vercel serverless functions
│   ├── .env.example              # Environment variables template
│   ├── .env.local                # Local environment (not committed)
│   └── SECRET_MANAGEMENT.md      # Security guide
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://ai.google.dev/gemini-api))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/zahidoverflow/quiz-builder.git
   cd quiz-builder/quiz-builder-ocr-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   copy .env.example .env.local
   ```
   
   Edit `.env.local` and add your Gemini API key:
   ```env
   API_KEY=your_actual_gemini_api_key_here
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

## Usage

1. Click the upload area or drag & drop an image of a quiz sheet
2. Click "Generate Quiz Bank" to process the image
3. Review and edit the extracted questions if needed
4. Add or remove questions as desired
5. Click "Copy All" to copy formatted questions to clipboard
6. Click "Start Over" to process a new image

## Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**
2. **Import project in Vercel**:
   - Set **Root Directory** to `quiz-builder-ocr-ai`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Add environment variable**:
   - Go to Project Settings → Environment Variables
   - Name: `API_KEY`
   - Value: Your Gemini API key
   - Apply to: Production, Preview, Development
4. **Deploy**

**Note**: For monorepo structure, it's crucial to set the root directory to `quiz-builder-ocr-ai` in Vercel project settings.

### Manual Build

```bash
npm run build
npm run preview
```

## Security

⚠️ **Important**: Never commit your `.env.local` file or expose your API keys.

See [SECRET_MANAGEMENT.md](./quiz-builder-ocr-ai/SECRET_MANAGEMENT.md) for detailed security guidelines.

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **AI Service**: Google Gemini 2.5 Flash API
- **Deployment**: Vercel
- **Styling**: Tailwind CSS (via CDN)

## API Reference

The application uses the Google Gemini API with structured output:

```typescript
interface Quiz {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

**"API_KEY environment variable is not set"**
- Ensure `.env.local` exists with `API_KEY` variable
- Restart the dev server after creating/modifying `.env.local`

**Image processing fails**
- Check image quality and clarity
- Ensure questions are clearly visible
- Verify API key is valid and has quota remaining

**Build errors**
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (18+ required)

## License

MIT License - see LICENSE file for details

## Author

**Zahid** - [@zahidoverflow](https://github.com/zahidoverflow)

## Acknowledgments

- Powered by [Google Gemini API](https://ai.google.dev/gemini-api)
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)
