from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os

app = Flask(__name__)
CORS(app) 

# استخدمنا النسخة tiny لتجنب مشكلة نفاد الذاكرة التي ظهرت عندك
model = whisper.load_model("tiny") 

@app.route('/transcribe', methods=['POST'])
def transcribe_video():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    video_file = request.files['file']
    file_path = "temp_video.mp4"
    video_file.save(file_path)

    try:
        result = model.transcribe(file_path)
        os.remove(file_path)
        return jsonify({"text": result['text']})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
    
