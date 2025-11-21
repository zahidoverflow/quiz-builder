# File Processing

This directory contains input and output files for N8N image processing workflows.

## Structure

### `input/`
- Place image files here for OCR processing
- Supported formats: JPG, PNG, GIF, WebP, HEIC, PDF
- Files will be automatically processed by N8N workflows

### `output/`
- Processed results are saved here
- Contains extracted quiz JSON files
- Organized by timestamp or workflow run

## Usage

1. **Upload Images:**
   ```
   files/input/quiz-chapter-1.jpg
   files/input/quiz-chapter-2.png
   ```

2. **Start N8N Workflow:**
   - Workflow monitors `input/` folder
   - Automatically processes new images
   - Uses Google Gemini for OCR extraction

3. **Get Results:**
   ```
   files/output/quiz-chapter-1-result.json
   files/output/quiz-chapter-2-result.json
   ```

## Workflow Integration

N8N workflows can:
- **Watch** the input folder for new files
- **Process** images using Gemini API
- **Extract** quiz questions and options
- **Save** formatted results to output folder
- **Clean up** processed input files (optional)

## File Naming Conventions

### Input Files:
- `quiz-[chapter]-[date].jpg`
- `mcq-[subject]-[page].png`
- Use descriptive names for better organization

### Output Files:
- `[input-name]-result.json` (processed quiz data)
- `[input-name]-log.txt` (processing details)
- `[timestamp]-batch-[count].json` (batch processing)

## Security Notes

- Input folder is monitored by N8N workflows
- Ensure no sensitive data in image filenames
- Output files may contain extracted text content
- Both folders are included in .gitignore for privacy