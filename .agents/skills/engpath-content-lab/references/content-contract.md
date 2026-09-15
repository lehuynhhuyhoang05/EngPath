# EngPath content contract

Use this contract for student-facing learning content. Omit fields only when the requested artifact is intentionally partial.

## Common metadata

```json
{
  "id": "stable-kebab-case-id",
  "grade": 9,
  "skills": ["word-form-adverb"],
  "prerequisites": ["parts-of-speech"],
  "difficulty": "foundation | core | advanced",
  "status": "draft",
  "authoringMethod": "human | ai-assisted | imported",
  "source": {
    "title": "source title or rationale",
    "url": "optional canonical URL",
    "retrievedAt": "optional ISO date"
  },
  "version": 1
}
```

## Objective question

```json
{
  "type": "single-choice",
  "prompt": "She speaks English ____.",
  "options": ["fluent", "fluently", "fluency", "influence"],
  "correctOptionIndex": 1,
  "explanationVi": "Động từ ‘speaks’ cần được bổ nghĩa bởi trạng từ ‘fluently’.",
  "commonErrorVi": "Nhầm tính từ ‘fluent’ với trạng từ ‘fluently’."
}
```

Requirements:

- exactly one correct answer;
- no duplicate or trivially impossible option unless pedagogically intended;
- sufficient context to determine the answer;
- explanation teaches the rule used in this item;
- no accidental clue from option length, capitalization, or grammar mismatch.

## Pronunciation prompt

```json
{
  "type": "scripted-pronunciation",
  "text": "I think Thursday will be sunny.",
  "locale": "en-US",
  "targetFeatures": ["phoneme-th-voiceless"],
  "reference": {
    "ipa": "optional only when verified",
    "source": "trusted dictionary or speech provider"
  },
  "remediationVi": "Đặt nhẹ đầu lưỡi giữa hai hàm răng rồi đẩy hơi ra; tránh đọc /θ/ thành /t/."
}
```

Do not invent IPA. If it cannot be verified, omit it and retain the source requirement for later review.

## Skill tagging

Prefer narrow observable skills such as `past-simple-irregular` or `reading-main-idea`. Avoid vague tags such as `english`, `grammar-good`, or `hard-question`.

Every diagnostic item should test as few skills as practical. Multi-skill items are allowed for reading and exam practice but make diagnostic interpretation less certain.

