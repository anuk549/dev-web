# JSON Export Guide - Dev+ Quote Builder

## Overview
The Dev+ Quote Builder now includes a powerful JSON export feature that generates a complete project specification. This JSON file can be used with AI models to automatically generate the configured project.

## How to Get the JSON File

### Option 1: Download JSON (Automatic)
1. Complete all configuration steps (Frontend → Relations)
2. Click "Compile Quote" at Step 7 (Relations)
3. Review your project in the Preview (Step 8)
4. Fill in your contact details (Step 9)
5. Click the **"Download JSON"** button (blue button)
6. The JSON file will be saved to your Downloads folder

### Option 2: WhatsApp Message
When you click "Send on WhatsApp":
- A detailed message will be sent with your project summary
- The message includes a note that the full JSON specification will be downloaded automatically
- You'll receive the JSON file separately via the download button

## JSON File Structure

The generated JSON includes:

### 1. Metadata
```json
{
  "metadata": {
    "generatedAt": "2026-06-18T12:30:00.000Z",
    "version": "1.0.0",
    "generator": "Dev+ Quote Builder"
  }
}
```

### 2. Client Information
```json
{
  "client": {
    "name": "Your Name",
    "email": "your@email.com",
    "whatsapp": "+94771234567",
    "university": "Your University",
    "description": "Project description"
  }
}
```

### 3. Technology Stack
```json
{
  "stack": {
    "frontend": {
      "framework": "React",
      "language": "TypeScript"
    },
    "backend": {
      "framework": "Next.js API",
      "runtime": "Node.js"
    },
    "database": {
      "engine": "PostgreSQL"
    }
  }
}
```

### 4. Features & Modules
```json
{
  "features": {
    "authentication": {
      "enabled": true,
      "methods": ["email-password"]
    },
    "security": {
      "passwordEncryption": true,
      "jwtTokens": false
    },
    "adminPanel": {
      "enabled": true
    }
  }
}
```

### 5. Database Schema
```json
{
  "database": {
    "tables": [
      {
        "name": "Students",
        "fields": [
          {
            "name": "id",
            "type": "integer",
            "constraints": {
              "primaryKey": true,
              "nullable": false,
              "unique": true
            }
          }
        ],
        "crud": {
          "create": true,
          "read": true,
          "update": true,
          "delete": true,
          "search": false
        }
      }
    ],
    "relationships": []
  }
}
```

### 6. API Endpoints (Auto-generated)
```json
{
  "apiEndpoints": [
    {
      "path": "/api/students",
      "methods": ["POST"],
      "description": "Create new Students record"
    }
  ]
}
```

### 7. Project Timeline
```json
{
  "timeline": {
    "estimatedDays": 3,
    "phases": [
      {
        "name": "Development",
        "duration": 2,
        "tasks": ["Set up project structure", ...]
      }
    ]
  }
}
```

### 8. Pricing
```json
{
  "pricing": {
    "breakdown": [
      {
        "label": "Frontend Development",
        "value": 25000
      }
    ],
    "total": 70000
  }
}
```

## Using the JSON with AI Models

### Step 1: Download the JSON
Click the "Download JSON" button in the Contact step.

### Step 2: Copy the JSON Content
Open the downloaded file and copy all the content.

### Step 3: Paste to AI Model
Use a prompt like:

```
Create a web project based on this specification:

[PASTE JSON CONTENT HERE]

Please generate:
1. Project structure
2. Database models
3. API endpoints
4. Frontend components
5. Authentication system
6. Any additional features specified
```

## Example Use Cases

### 1. Full Project Generation
```bash
# Copy the JSON and use with AI:
# "Create a complete web application based on this spec:"
```

### 2. Database Schema Generation
```bash
# Extract the database section:
# "Generate SQL/NoSQL schema from this specification:"
```

### 3. API Documentation
```bash
# Extract the apiEndpoints section:
# "Create API documentation from these endpoints:"
```

## File Naming Convention

The JSON file is automatically named as:
```
project-spec-{your-name}-{timestamp}.json
```

Example: `project-spec-kasun-perera-1718712000000.json`

## Tips for Best Results

1. **Complete All Steps**: Fill in all configuration steps for a complete specification
2. **Add Detailed Description**: Include project requirements in the "Topic details" field
3. **Review Before Download**: Check the Preview (Step 8) to ensure everything is correct
4. **Save the JSON**: Keep the JSON file for reference during development
5. **Share with Developer**: Send the JSON file to your developer along with the WhatsApp message

## Troubleshooting

### JSON Not Downloading?
- Check your browser's download settings
- Ensure pop-ups are allowed for the site
- Try clicking the button again

### JSON File Too Large?
- The file size depends on the number of tables and fields
- Typical files are 2-10 KB
- If very large, consider simplifying the schema

### Need to Modify JSON?
- You can edit the JSON file manually
- Be careful with JSON syntax (commas, brackets, quotes)
- Validate JSON at jsonlint.com before using

## Support

For questions or issues:
- WhatsApp: Use the WhatsApp button in the app
- Email: anuk200101@gmail.com

---

**Generated by Dev+ Quote Builder**
*Version 1.0.0*