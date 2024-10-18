from datetime import datetime
from abc import ABC, abstractmethod
from uuid import uuid4
from typing import Union, List, Dict, Optional


class ResponseBase(ABC):
    """Response用の基底クラス"""

    @abstractmethod
    def __init__(self):
        pass

    @abstractmethod
    def get_response(self):
        raise NotImplementedError


class ApiResponse(ResponseBase):
    """レスポンスを返却するたのクラス

    Attributes:
        data (any): 返却データ
        messages (dict): メッセージ
    """

    def __init__(
        self,
        request_id: Optional[str],
        payload: Union[str, List, Dict],
        messages: Union[List, Dict],
    ):
        self.payload = payload
        self.messages = messages
        self.request_id = request_id
        # views.pyのcreate_response()で呼び出されたときに上書きされる
        # APIException発生時はインスタンス生成時の時刻を採用
        self.start_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")
        self.end_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")

    @property
    def request_id(self):
        return self.__rid

    @request_id.setter
    def request_id(self, request_id):
        self.__rid = request_id

    @property
    def payload(self):
        return self.__payload

    @payload.setter
    def payload(self, payload):
        self.__payload = payload

    @property
    def messages(self):
        return self.__messages

    @messages.setter
    def messages(self, messages):
        self.__messages = messages

    def get_response(self) -> dict:
        # ない場合は生成する
        if self.request_id is None:
            self.request_id = str(uuid4())

        return {
            "request_id": self.request_id,
            "start_datetime": self.start_datetime,
            "end_datetime": self.end_datetime,
            "payload": self.payload,
            "messages": self.messages,
        }
