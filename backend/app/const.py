from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=".env.local")

LIFF_CHANNEL_ID = os.getenv("LIFF_CHANNEL_ID")