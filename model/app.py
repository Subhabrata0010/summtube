import gradio as gr
import tempfile
import os
import subprocess
from transformers import pipeline

# ------------------------
# Load models once
# ------------------------
print("Loading models...")
asr = pipeline("automatic-speech-recognition", model="openai/whisper-small")
summarizer = pipeline("text2text-generation", model="google/flan-t5-base")
print("Models loaded.")

# ------------------------
# Helper function to extract audio
# ------------------------
def extract_audio(input_path, output_path):
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        input_path,
        "-ar", "16000",
        "-ac", "1",
        "-vn",
        output_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

# ------------------------
# Core processing function
# ------------------------
def process_file(uploaded_file):
    # Save temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(uploaded_file.name)[1]) as tmp:
        tmp.write(uploaded_file.read())
        input_path = tmp.name

    try:
        # Extract audio if video
        if input_path.endswith((".mp4", ".mkv", ".mov")):
            audio_path = input_path + ".wav"
            extract_audio(input_path, audio_path)
        else:
            audio_path = input_path

        # ASR
        transcript = asr(audio_path)["text"]

        # Summarization
        summary = summarizer(transcript, max_length=150, min_length=30, do_sample=False)[0]["generated_text"]

        return {"transcript": transcript, "summary": summary}

    finally:
        os.remove(input_path)
        if input_path != audio_path:
            os.remove(audio_path)

# ------------------------
# Gradio interface (hidden)
# ------------------------
iface = gr.Interface(
    fn=process_file,
    inputs=gr.File(file_types=[".mp3", ".wav", ".mp4", ".mkv", ".mov"]),
    outputs=gr.JSON(),
    live=False
)

iface.launch(server_name="0.0.0.0", server_port=7860, share=False)
