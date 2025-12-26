from flask import Flask, request, jsonify
from flask_cors import CORS
from faster_whisper import WhisperModel
import os

app = Flask(__name__)
CORS(app)

# تحميل نسخة خفيفة جداً وموفرة للذاكرة
model = WhisperModel("tiny", device="cpu", compute_type="int8")

@app.route('/transcribe', methods=['POST'])
def transcribe_video():
    if 'file' not in request.files:
        return jsonify({"error": "No file"}), 400
    
    file = request.files['file']
    file_path = "temp_video.mp4"
    file.save(file_path)

    try:
        # معالجة الفيديو واستخراج النص
        segments, info = model.transcribe(file_path, beam_size=5)
        text = " ".join([segment.text for segment in segments])
        
        if os.path.exists(file_path):
            os.remove(file_path)
            
        return jsonify({"text": text})
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
