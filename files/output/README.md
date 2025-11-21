# Output Results

Processed quiz data and results are saved here.

## File Types

### JSON Results
- `[filename]-result.json` - Extracted quiz questions
- `[filename]-metadata.json` - Processing information
- `batch-[timestamp].json` - Multiple files processed together

### Processing Logs
- `[filename]-log.txt` - Detailed processing information
- `error-[timestamp].txt` - Error logs and debugging info
- `summary-[date].json` - Daily processing summary

## JSON Structure

```json
{
  "source_file": "quiz-chapter-1.jpg",
  "processed_at": "2025-11-21T10:30:00Z",
  "total_questions": 25,
  "questions": [
    {
      "id": 1,
      "question": "What is the capital of France?",
      "options": {
        "A": "London",
        "B": "Berlin", 
        "C": "Paris",
        "D": "Madrid"
      },
      "answer": "C"
    }
  ],
  "processing_stats": {
    "ocr_confidence": 0.95,
    "extraction_time": "2.3s",
    "gemini_model": "gemini-2.5-flash"
  }
}
```

## File Organization

```
output/
├── 2025-11-21/           # Daily folders
│   ├── quiz-results/     # Successful extractions
│   ├── errors/           # Failed processing
│   └── logs/             # Processing logs
├── archive/              # Older results
└── templates/            # Output format templates
```

## Usage

1. **Review Results**: Check JSON files for accuracy
2. **Import Data**: Use JSON in your quiz applications
3. **Verify Extraction**: Compare with original images
4. **Handle Errors**: Check error logs for failed processing

## Data Validation

- Questions should have exactly 4 options (A, B, C, D)
- Answer field should match one of the option letters
- Text should be properly formatted and readable
- Special characters and symbols should be preserved