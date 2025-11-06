# Backend (Express) for Speaking Practice App - Mock Implementation

## Quick start (Node.js required)

1. `cd backend`
2. `npm install`
3. `npm start`

Endpoints (mocked):
- POST /api/v1/questions/fetch  -> { exam, mode, count }
- POST /api/v1/questions/upload-image -> form-data image
- POST /api/v1/practice/upload-audio -> form-data audio
- POST /api/v1/generate/mindmap -> { source_text, lang }
