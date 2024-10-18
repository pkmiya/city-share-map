from app.schemas.apiexeption import ApiResponse

class ApiException(Exception):
    """
        APIのエラークラス

       Attributes:
                status_code (int): ステータス情報
                api_response (ApiResposne): 結果を格納し返却する
    """

    def __init__(self, status_code: int, api_response: ApiResponse):
        self.status_code = status_code
        self.api_response = api_response

    @property
    def status_code(self):
        return self.__status_code

    @status_code.setter
    def status_code(self, status_code):
        self.__status_code = status_code

    @property
    def api_response(self):
        return self.__api_response

    @api_response.setter
    def api_response(self, api_response):
        self.__api_response = api_response
    
    

