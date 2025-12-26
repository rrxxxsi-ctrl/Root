from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os

app = Flask(__name__)
CORS(app) # للسماح للواجهة بالاتصال بالسيرفر

# تحميل نموذج الذكاء الاصطناعي (يتم تحميله مرة واحدة عند تشغيل السيرفر)
print("Loading AI Model... Please wait.")
model = whisper.load_model("base") 

@app.route('/transcribe', methods=['POST'])
def transcribe_video():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    video_file = request.files['file']
    file_path = "temp_video.mp4"
    video_file.save(file_path)

    try:
        # عملية استخراج النص باستخدام الذكاء الاصطناعي
        result = model.transcribe(file_path, language='ar')
        extracted_text = result['text']
        
        # حذف الملف المؤقت بعد المعالجة
        os.remove(file_path)
        
        return jsonify({"text": extracted_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
  
