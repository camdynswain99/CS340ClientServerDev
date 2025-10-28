from flask import Flask, request, jsonify
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch

#call python gpt2_server.py to run server on port 5001 from cli

app = Flask(__name__)

tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")
model.eval()

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    prompt = data.get("prompt", "")

    inputs = tokenizer.encode(prompt, return_tensors="pt")
    outputs = model.generate(inputs, max_length=100, do_sample=True)
    text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return jsonify({"response": text})

if __name__ == "__main__":
    app.run(port=5001)
