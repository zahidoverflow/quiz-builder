### PROJECT: Class 6 Quiz Bank Generator  
### SUBJECT: [SUBJECT NAME]  
### CHAPTER: [CHAPTER NAME]  
### SOURCE: MCQ images provided  

Your task is to extract, clean, expand, and format MCQs from the provided chapter images.  
Follow the instructions *strictly*.

--------------------------------------------

## 1. INPUT IMAGES  
Process all MCQ questions from the attached images:  
[IMAGES]

Extract everything that looks like an MCQ:
- Question (can be in English or Bengali)
- Options (Bangla OR English)
- Numbers
- Symbols (°, →, etc.)

--------------------------------------------

## 2. OCR + CLEANING RULES  
While converting image → text:
- Correct spelling errors (Bangla + English).
- Fix broken words, line breaks, merged words.
- Maintain original meaning.
- Convert Bangla numerals to English numerals (01, 02, 03…).
- Options generally always follow the inline format:
     A) …  B) …  
     C) …  D) …
   and for possible short options
     A) …  B) …  C) …  D) …
- Preserve the original language and text exactly as it appears.
- Return the data in the specified JSON format.

No additional explanation. No answer key unless asked.

--------------------------------------------

## 3. QUIZ EXPANSION TO EXACTLY 100 MCQs  
After extracting all MCQs from the images:

1. Count the extracted questions.  
2. If the count is **less than 100**, do not generate additional MCQs
   - Use *only* the MCQ found inside the input images of pages.
   - There should NOT be any duplicate.
   - All MCQs must not be out of any MCQ from provided input images

3. If the count is **more than 100**, intelligently select the best set of 100:
   - Keep concept coverage balanced.
   - Avoid redundancy.

--------------------------------------------

## 4. OUTPUT FORMAT (STRICT)  
Produce the final output in **clean, ready-to-use Google Docs format**:

