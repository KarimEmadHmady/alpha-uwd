# Page Content with Images API

نظام متكامل لإدارة محتوى الصفحات مع رفع الصور باستخدام multer

## الميزات

✅ رفع صور متعددة مع محتوى الصفحة
✅ حفظ الصور في مجلد `uploads/Contant-page`
✅ معالجة تلقائية للأخطاء والملفات غير المدعومة
✅ حد أقصى 5MB لكل صورة
✅ دعم صيغ: JPEG, PNG, WebP, GIF

## الاستخدام

### 1. تحديث محتوى مع صور (multipart/form-data)

```bash
curl -X PUT http://localhost:3000/alpha/api/page-content/home \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "content={\"hero\":{\"title\":{\"ar\":\"عنوان\",\"en\":\"Title\"},\"backgroundImage\":\"uploads/Contant-page/bg.jpg\"},\"sections\":[{\"title\":{\"ar\":\"قسم\",\"en\":\"Section\"},\"image\":\"uploads/Contant-page/img.jpg\"}]}" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

### 2. استجابة ناجحة

```json
{
  "success": 1,
  "message": "Page content updated successfully",
  "page": "home",
  "content": {
    "hero": {
      "title": {
        "ar": "عنوان",
        "en": "Title"
      },
      "backgroundImage": "uploads/Contant-page/bg.jpg"
    }
  },
  "updated_at": "2026-05-11T10:30:00.000Z",
  "uploadedImages": [
    {
      "originalName": "image1.jpg",
      "filename": "image1-1715425800000-123456789.jpg",
      "path": "uploads/Contant-page/image1-1715425800000-123456789.jpg",
      "size": 102400
    }
  ]
}
```

### 3. هيكل محتوى JSON مثالي

```json
{
  "hero": {
    "title": { "ar": "عنواننا", "en": "Our Title" },
    "description": { "ar": "وصف...", "en": "Description..." },
    "backgroundImage": "uploads/Contant-page/hero-bg.jpg"
  },
  "sections": [
    {
      "name": { "ar": "القسم الأول", "en": "First Section" },
      "content": { "ar": "محتوى...", "en": "Content..." },
      "image": "uploads/Contant-page/section1.jpg"
    },
    {
      "name": { "ar": "القسم الثاني", "en": "Second Section" },
      "image": "uploads/Contant-page/section2.jpg"
    }
  ]
}
```

## أمثلة Postman

### في Postman، استخدم `form-data`:

| Key | Value | Type |
|-----|-------|------|
| content | `{"hero":{...}}` | Text (JSON) |
| images | [file] | File |
| images | [file] | File |

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

## معالجة الأخطاء

```json
{
  "success": 0,
  "message": "File size exceeds 5MB limit"
}
```

أنواع الأخطاء:
- `Invalid file type` - نوع ملف غير مدعوم
- `File size exceeds 5MB limit` - الملف أكبر من الحد المسموح
- `Content must be valid JSON` - محتوى JSON غير صحيح

## الملاحظات

- الصور المرفوعة تحصل على اسم فريد: `{اسم-البداية}-{timestamp}-{رقم عشوائي}.{صيغة}`
- يمكن استخدام مسار الصورة المعاد في content JSON مباشرة
- الصور تُخزن دائماً في `uploads/Contant-page/`
- جميع الصور المرفوعة يتم إرجاعها في حقل `uploadedImages` بالـ response
