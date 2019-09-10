import requests
from errors.not_authenticated_error import NotAuthenticatedUserError 

class GoogleAuth:
    def __init__(self, client_id: str):
        self.client_id = client_id

    def get_user_email(self, acess_token: str) -> str:
        response_body = requests.get(url = 'https://www.googleapis.com/oauth2/v3/tokeninfo', params='access_token=' + acess_token).json()
        if self.is_valid(response_body):
            return response_body["email"]
        else:
            raise NotAuthenticatedUserError


    def is_valid(self, google_response: str) -> bool:
        if 'error_description' in google_response:
            return False
        if google_response['aud'] != self.client_id:
            return False
        return True