# نظام رفع الصور - دليل القاعدة البيانات

## الجدول الحالي: `page_contents`

```sql
CREATE TABLE page_contents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page VARCHAR(255) UNIQUE NOT NULL,
  content LONGTEXT NOT NULL,  -- JSON
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## التعديلات المطلوبة

الجدول الحالي **كافي تماماً** للنظام الجديد! ✅

**السبب:**
- الصور تُخزن **في نظام الملفات** (`uploads/Contant-page/`)
- مسارات الصور تُحفظ **داخل عمود `content` (JSON)**
- لا توجد أعمدة إضافية مطلوبة

## هيكل البيانات في JSON

### قبل:
```json
{
  "hero": {
    "title": { "ar": "العنوان", "en": "Title" }
  }
}
```

### بعد (مع الصور):
```json
{
  "hero": {
    "title": { "ar": "العنوان", "en": "Title" },
    "backgroundImage": "uploads/Contant-page/bg-1715425800000-123456789.jpg"
  },
  "sections": [
    {
      "name": { "ar": "القسم", "en": "Section" },
      "image": "uploads/Contant-page/section-1715425800000-987654321.jpg"
    }
  ]
}
```

## نموذج SQL للإدراج

```sql
INSERT INTO page_contents (page, content) VALUES (
  'home',
  '{
    "hero": {
      "title": { "ar": "الصفحة الرئيسية", "en": "Home Page" },
      "backgroundImage": "uploads/Contant-page/hero-bg.jpg"
    }
  }'
) ON DUPLICATE KEY UPDATE
  content = VALUES(content),
  updated_at = CURRENT_TIMESTAMP;
```

## مسارات الملفات

### هيكل المجلدات:
```
backend/
├── uploads/
│   └── Contant-page/           ← هنا تُحفظ الصور
│       ├── bg-1715425800000.jpg
│       ├── section-1715425800000.jpg
│       └── ...
├── src/
│   └── services/
│       └── page-content.service.js
```

### المسار المُرجع في الـ Response:
```
uploads/Contant-page/bg-1715425800000.jpg
```

## الملاحظات المهمة

1. **لا توجد تغييرات قاعدة بيانات مطلوبة** ✅
2. **جميع الصور المرفوعة لها أسماء فريدة** (تستخدم timestamp)
3. **يمكن استرجاع الصور مباشرة عبر مسار URL**:
   ```
   GET http://localhost:3000/uploads/Contant-page/image.jpg
   ```

## خطوة تأكيد قاعدة البيانات

تأكد من وجود جدول `page_contents`:

```sql
DESCRIBE page_contents;
```

يجب أن تري:
| Field | Type | Null | Key | Default | Extra |
|-------|------|------|-----|---------|-------|
| id | int | NO | PRI | NULL | auto_increment |
| page | varchar(255) | NO | UNI | NULL | |
| content | longtext | NO | | NULL | |
| created_at | timestamp | NO | | CURRENT_TIMESTAMP | |
| updated_at | timestamp | NO | | CURRENT_TIMESTAMP | on update CURRENT_TIMESTAMP |

إذا لم يكن موجوداً، استخدم الأمر أعلاه لإنشاؤه.
