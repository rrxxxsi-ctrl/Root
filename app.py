from flask import Flask, request, jsonify
from flask_cors import CORS
from faster_whisper import WhisperModel
import os

app = Flask(__name__)
CORS(app)

# تحميل نموذج خفيف جداً لا يستهلك الرام
model_size = "tiny"
model = WhisperModel(model_size, device="cpu", compute_type="int8")

@app.route('/transcribe', methods=['POST'])
def transcribe_video():
    if 'file' not in request.files:
        return jsonify({"error": "No file"}), 400
    
    file = request.files['file']
    file.save("temp.mp4")

    try:
        segments, info = model.transcribe("temp.mp4", beam_size=5)
        text = "".join([segment.text for segment in segments])
        os.remove("temp.mp4")
        return jsonify({"text": text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
