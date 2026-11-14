import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "SatQuery Production Pipeline"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    PLANETARY_COMPUTER_KEY: str = os.getenv("PC_SDK_KEY", "")
    PORT: int = int(os.getenv("PORT", "8000"))

settings = Settings()