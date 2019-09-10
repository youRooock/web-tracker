from flask import Flask, request, jsonify
from google_auth import GoogleAuth
from errors.not_authenticated_error import NotAuthenticatedUserError

app = Flask(__name__)
google_auth = GoogleAuth("your_token")
cache = {}

@app.route('/', methods=['POST'])
def changed_navigation():
    try:
        headers = request.headers
        url = request.values["url"]
        params = {
            'url': url
        }
        user_email = google_auth.get_user_email(headers['AUTHORIZATION'])

        if url in cache:
            cache[url] += 1
        else:
            cache[url] = 1
        return jsonify({"message": "Done"}), 200 

    except NotAuthenticatedUserError as e:
        return jsonify({"message": "Unathorized access"}), 401

if __name__ == '__main__':
    app.run()