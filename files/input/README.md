# Input Images

Place your quiz images here for OCR processing.

## Supported Formats

- **JPG/JPEG** - Most common format
- **PNG** - Good for screenshots  
- **GIF** - Animated or static
- **WebP** - Modern web format
- **HEIC** - iPhone camera format
- **PDF** - Multi-page documents

## File Size Limits

- **Max file size:** 20MB per image
- **Recommended:** Under 10MB for faster processing
- **Multiple pages:** Split PDFs into individual images

## Naming Tips

Use descriptive filenames:
```
quiz-physics-chapter1.jpg
mcq-math-algebra-page2.png
questions-chemistry-organic.pdf
```

## Processing Flow

1. Drop images in this folder
2. N8N workflow detects new files
3. Images sent to Google Gemini for OCR
4. Extracted quiz data saved to `../output/`
5. Original images moved to processed subfolder (optional)

## File Status

- ✅ **Ready**: Files waiting for processing
- ⏳ **Processing**: Currently being analyzed  
- ✅ **Completed**: Moved to output or archived
- ❌ **Error**: Check logs in output folder