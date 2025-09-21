from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

app = FastAPI()

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Maximum file size (e.g., 5 MB)
MAX_FILE_SIZE = 5 * 1024 * 1024

ALLOWED_EXTENSIONS = [".csv", ".xlsx"]
REQUIRED_COLUMNS = ["Biomarker", "Value"]


def sanitize_value(value):
    """
    Prevent formula injection in Excel/CSV.
    If the value starts with =, +, -, or @, escape it.
    """
    if isinstance(value, str) and value and value[0] in ("=", "+", "-", "@"):
        return "'" + value  
    return value

@app.post("/analyze")
async def analyze_report(file: UploadFile = File(...)):
    # Check file extension
    if not any(file.filename.endswith(ext) for ext in ALLOWED_EXTENSIONS):
        raise HTTPException(status_code=400, detail="Unsupported file format")
    
    # Check file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large")

    # Use a BytesIO object safely
    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith(".xlsx"):
            df = pd.read_excel(io.BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to read file. Make sure it's a valid CSV or Excel.")

    # Validate required columns
    if not all(col in df.columns for col in REQUIRED_COLUMNS):
        raise HTTPException(status_code=400, detail=f"File must contain columns: {REQUIRED_COLUMNS}")

    # Sanitize all string cells in the DataFrame
    df = df.applymap(sanitize_value)

    # Reference ranges
    reference = {
        "Hemoglobin": (13, 17),
        "Vitamin D": (20, 50),
        "Cholesterol": (0, 200),
        "Blood Sugar Fasting": (70, 100),
    }

    # Process results
    results = []
    for _, row in df.iterrows():
        try:
            biomarker = str(row["Biomarker"]).strip()
            value = float(row["Value"])
        except (ValueError, TypeError):
            results.append({
                "biomarker": row.get("Biomarker", "Unknown"),
                "value": row.get("Value", None),
                "status": "Invalid Value"
            })
            continue

        low, high = reference.get(biomarker, (None, None))

        if low is None or high is None:
            status = "Unknown"
        elif value < low:
            status = "Low"
        elif value > high:
            status = "High"
        else:
            status = "Normal"

        results.append({
            "biomarker": biomarker,
            "value": value,
            "status": status
        })

    return results
