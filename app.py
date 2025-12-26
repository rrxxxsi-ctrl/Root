from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os

app = Flask(__name__)
CORS(app) 

# تم استخدام نموذج tiny لأنه الأخف والأسرع ويناسب ذاكرة السيرفر المجاني
print("جاري تحميل نموذج الذكاء الاصطناعي...")
model = whisper.load_model("tiny") 

@app.route('/transcribe', methods=['POST'])
def transcribe_video():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    video_file = request.files['file']
    # اسم ملف مؤقت لمعالجة الفيديو
    file_path = "temp_video.mp4"
    video_file.save(file_path)

    try:
        # البدء في استخراج النص
        print(f"جاري معالجة الملف: {video_file.filename}")
        result = model.transcribe(file_path)
        
        # حذف الملف المؤقت بعد الانتهاء لتوفير المساحة
        if os.path.exists(file_path):
            os.remove(file_path)
            
        return jsonify({"text": result['text']})
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # إعداد المنفذ ليتوافق مع منصة Render
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
