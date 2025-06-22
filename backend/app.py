from flask import Flask, request, jsonify
from model import generate_avatar
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/generate-avatar", methods=["POST"])
def generate():
    data = request.json
    avatar = generate_avatar(data)
    return jsonify({"avatar_url": avatar})

if __name__ == "__main__":
    app.run(debug=True)
