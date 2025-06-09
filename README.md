# CS Style Guides

A collection of style guides and best practices for AI editing and writing projects.

## Contents

### Writing Style Guides
- **[Wolf Schneider.md](Wolf%20Schneider.md)** - Rules for clear, concise German based on Wolf Schneider's principles
- **[Gendergerecht mit Sternchen.md](Gendergerecht%20mit%20Sternchen.md)** - Gender-inclusive German using asterisk notation (e.g., Student*innen)
- **[Gendergerecht ohne Sternchen.md](Gendergerecht%20ohne%20Sternchen.md)** - Gender-inclusive German using alternative forms (neutral terms, participles)

### Presentation Guidelines
- **[Gute Praesentation.md](Gute%20Praesentation.md)** - Comprehensive guidelines for creating effective presentations

## Overview

This repository contains style guides designed to help AI systems maintain consistency and quality when editing and writing content. Each guide provides structured approaches and best practices that can be used as instructions or reference material for AI-assisted writing tasks.

### Gender-Inclusive Language Options

The two gender-inclusive language guides are **alternatives** - choose one based on your preferences or requirements:
- Use **"mit Sternchen"** if you prefer the modern asterisk notation
- Use **"ohne Sternchen"** if you prefer traditional neutral forms without special characters

## How to Use with Claude

### Loading Files into Claude Projects

There are two main ways to use these style guides with Claude:

#### Method 1: Copy and Paste (Simple)
1. Open the style guide file(s) you want to use
2. Copy the entire content
3. Paste at the beginning of your Claude conversation
4. Reference the style in your request

#### Method 2: Using Claude Projects (Recommended)
1. **Create a new Project** in Claude (claude.ai)
2. **Add files to Project Knowledge**:
   - Click "Add content" in your project
   - Upload the .md files directly, or
   - Copy-paste the content as project instructions
3. **Start conversations** within that project - Claude will automatically have access to all style guides
4. **Reference specific guides** in your prompts

### Example Prompts

#### Example 1: Writing with Gender-Inclusive Language
```
Using the "Gendergerecht mit Sternchen" style guide, please write a job posting 
for a software developer position.
```

#### Example 2: Editing for Clarity
```
Please edit the following text according to Wolf Schneider's principles:
[Your text to edit]
```

#### Example 3: Creating a Presentation
```
Help me create a presentation about our Q4 results following the "Gute Praesentation" 
guidelines. The presentation should tell a clear story using the SCS pattern.
```

#### Example 4: Combining Multiple Guides
```
Write a company announcement that follows both:
1. Wolf Schneider's principles for clarity
2. Gender-inclusive language (ohne Sternchen variant)
```

### Project Setup Example

If you're using Claude Projects, you might set up your project like this:

**Project Name**: "German Business Writing"

**Project Instructions**:
```
This project helps write and edit German business texts. 
Available style guides:
- Wolf Schneider.md - For clear, concise writing
- Gendergerecht mit Sternchen.md - For gender-inclusive language with asterisks
- Gendergerecht ohne Sternchen.md - For gender-inclusive language without asterisks
- Gute Praesentation.md - For effective presentations

Always ask which style guide to follow if not specified.
```

### Tips for Best Results

1. **Be explicit** - Tell Claude which style guide to follow
2. **Combine guides** - You can use multiple guides together (e.g., Wolf Schneider + a gender-inclusive variant)
3. **Provide examples** - If you have specific preferences, show Claude examples
4. **Iterate** - Ask Claude to revise based on specific rules from the guides

## Contributing

When adding new style guides:
1. Follow the existing format and structure
2. Write clear, unambiguous rules that AI systems can interpret
3. Include practical examples where applicable
4. Maintain language consistency within each document
5. Consider how AI systems will parse and apply the guidelines

## Language Notes

All guides in this repository are written in German, as they focus on German language writing and presentation styles. The examples and rules are specifically tailored to German language conventions.

## License

This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](LICENSE).

You are free to:
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material for any purpose, even commercially

Under the following terms:
- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.

### Attribution Example
```
This work is based on "CS Style Guides" by Christoph Schwerdtfeger, licensed under CC BY 4.0.
```