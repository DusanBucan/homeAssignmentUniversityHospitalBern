import argparse
import json
from pydicom import dcmread
from pydicom.errors import InvalidDicomError
from datetime import datetime

def getDicomValue(ds, tag):
    value = getattr(ds, tag, None)

    if not value:
        return "Unknown"

    if tag == "PatientBirthDate" and isinstance(value, str) and len(value) == 8:
        try:
            return datetime.strptime(value, "%Y%m%d").strftime("%Y-%m-%d")
        except ValueError:
            return value

    return str(value)

def convert_dicom(filepath):
    try:
        with dcmread(filepath) as ds:  
            PatientName = getDicomValue(ds, "PatientName")
            PatientBirthDate = getDicomValue(ds, "PatientBirthDate")        
            SeriesDescription = getDicomValue(ds, "SeriesDescription")

            return {
                "PatientName": PatientName,
                "PatientBirthDate": PatientBirthDate,
                "SeriesDescription": SeriesDescription,
            }

    except FileNotFoundError:
        return {"error": "File not found"}
    except InvalidDicomError:
        return {"error": "Invalid DICOM file"}
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}

def main():
    parser = argparse.ArgumentParser(description="Convert DICOM file to JSON format.")
    parser.add_argument(
        "filepath",
        help="Path to the DICOM file"
    )
    args = parser.parse_args()

    dicom_data = convert_dicom(args.filepath)
    dicom_data_json = json.dumps(dicom_data)
    print(dicom_data_json)


if __name__ == "__main__":
    main()
