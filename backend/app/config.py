import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Project Liquid — NASA NISAR Telemetry Service"
    NASA_EARTHDATA_USER: str = os.getenv("NASA_EARTHDATA_USER", "")
    NASA_EARTHDATA_PASS: str = os.getenv("NASA_EARTHDATA_PASS", "")
    EARTHDATA_TOKEN: str = os.getenv("EARTHDATA_TOKEN", "")
    PORT: int = int(os.getenv("PORT", "8000"))

settings = Settings()
