// Minimal backend for Speaking Practice App (mocked services)
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const upload = multer({ dest: 'uploads/' });
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Mock fetch questions
app.post('/api/v1/questions/fetch', async (req, res) => {
  const { exam = 'SPM', mode = 'ai', count = 1 } = req.body || {};
  const items = [];
  for (let i=0;i<count;i++) {
    items.push({
      id: `q-${Date.now()}-${i}`,
      exam,
      part: exam === 'SPM' ? 'Part2' : (exam === 'TOEFL' ? 'Task1' : 'Part2'),
      title: exam === 'SPM' ? 'Talk about a person you admire' : (exam === 'TOEFL' ? 'Do you prefer studying alone or with others?' : 'Describe a memorable event'),
      prompts: [
        "Who is this person?", "What do they do?", "Why do you admire them?"
      ],
      source: mode === 'web' ? 'https://example.com/sample-question' : null,
      generated_by: mode
    });
  }
  res.json({ items });
});

// OCR-like image upload endpoint (mock)
app.post('/api/v1/questions/upload-image', upload.single('image'), (req, res) => {
  // In real deployment: call OCR and parse text. Here we mock.
  const mock = {
    id: `img-${Date.now()}`,
    exam: 'SPM',
    part: 'Part2',
    title: 'Talk about a family celebration you had recently',
    prompts: ['What the event was?', 'What did you do there?', 'Why are family celebrations important in Malaysia?'],
    generated_by: 'ocr-mock'
  };
  // remove uploaded file (cleanup)
  if (req.file && req.file.path) {
    try { fs.unlinkSync(req.file.path) } catch(e){}
  }
  res.json({ item: mock });
});

// Upload audio, return mocked STT + grammar/score report
app.post('/api/v1/practice/upload-audio', upload.single('audio'), async (req, res) => {
  // Save file metadata and simulate processing
  const audioInfo = {};
  if (req.file) {
    audioInfo.originalname = req.file.originalname;
    audioInfo.mimetype = req.file.mimetype;
    audioInfo.size = req.file.size;
  }
  // Mock transcript and simple grammar detection
  const transcript = "I admire my grandmother because she was very kind and always help us.";
  const grammarIssues = [
    { error: 'was very kind', fix: 'is/has been very kind (use present/past consistently depending on context)' }
  ];
  const report = {
    transcript,
    grammarIssues,
    scores: {
      fluency: 72,
      grammar: 68,
      vocabulary: 70,
      pronunciation: 65,
      overall_percent: 69
    },
    suggestions: [
      'Reduce pauses by practicing chunks of speech.',
      'Use consistent verb tenses and varied sentence structures.',
      'Try shadowing the model answer to improve pronunciation.'
    ]
  };
  // cleanup uploaded file to avoid storage buildup (in demo)
  if (req.file && req.file.path) {
    try { fs.unlinkSync(req.file.path) } catch(e){}
  }
  res.json({ report, audio: audioInfo });
});

// Mindmap generation (mock LLM output, strict JSON)
app.post('/api/v1/generate/mindmap', (req, res) => {
  const { source_text = 'Why people shop online', lang = 'en' } = req.body || {};
  const mindmap = {
    central: source_text,
    branches: [
      { title: 'Convenience', subpoints: ['No queues', 'Time saving', 'Home delivery'] },
      { title: 'Variety', subpoints: ['More options', 'Easier comparison'] },
      { title: 'Price', subpoints: ['Discounts', 'Coupons'] }
    ],
    lang
  };
  res.json({ mindmap, svg: null });
});

app.get('/', (req, res) => res.send('Speaking Practice Backend (mock) is running.'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
