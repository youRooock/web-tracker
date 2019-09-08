import requests
from flask import Flask, request, jsonify
app = Flask(__name__)
cache = {}

@app.route('/', methods=['POST'])
def on_changed_navigation():
    try:
        headers = request.headers
        url = request.values["url"]
        params = {
            'url': url
        }
        response_body = requests.get(url = 'https://www.googleapis.com/oauth2/v3/tokeninfo', params='access_token='+headers['AUTHORIZATION']).json()

        if 'error_description' in response_body:
            return jsonify({"message": "ERROR: Unauthorized"}), 401 

        # token = "ya29.Gl58B4Bt-tUopC49qntOfa5MhLRp-1secl7KObWb0240MmM1uTRC6o2L5w0VbmL_hlTUOYPAnLJeUJoHKEn6K38kVSD9ZHYWdod01as5wsGRdoHy3LbwoI8_UnWK8x_h"
        # Specify the CLIENT_ID of the app that accesses the backend:
        # idinfo = id_token.verify_oauth2_token(token, requests.Request(), "292261455501-sccoc0gg2m9lur7vti9egr4k0f48rjp6.apps.googleusercontent.com")

        # Or, if multiple clients access the backend server:
        # idinfo = id_token.verify_oauth2_token(token, requests.Request())
        # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
        #     raise ValueError('Could not verify audience.')

        if response_body['aud'] not in ['your_token']:
            raise ValueError('Wrong app')

        # If auth request is from a G Suite domain:
        # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
        #     raise ValueError('Wrong hosted domain.')

        if url in cache:
            cache[url] += 1
        else:
            cache[url] = 1
        return jsonify({"message": "DOne"}), 200 

    except ValueError as e:
        # Invalid token
        pass

if __name__ == '__main__':
    app.run()