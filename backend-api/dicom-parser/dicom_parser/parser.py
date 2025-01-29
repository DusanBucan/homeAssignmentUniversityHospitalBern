import argparse
import json

# import os
import numpy as np
from pydicom import dcmread
from pydicom.multival import MultiValue
from pydicom.valuerep import PersonName


def getDicomValue(ds, name):
    value = ds.get(name)

    if value is None:
        return ""

    if isinstance(value, MultiValue):
        array = np.array(value)
        # Convert NumPy array to list
        return array.tolist()

    if isinstance(value, PersonName):
        return value.formatted("format_str")  # Adjust as needed

    if isinstance(value, np.ndarray):
        return value.tolist()  # Convert NumPy arrays to lists

    if isinstance(value, (np.floating, np.integer)):
        return value.item()  # Convert NumPy scalar to native Python type

    return value


def convert_dicom(filepath):
    ds = dcmread(filepath)
    pixel_data = ds.pixel_array
    try:
        rescale_intercept = ds.RescaleIntercept
    except Exception:
        rescale_intercept = 0

    pixel_data_float = pixel_data.astype(float)
    pixel_data_float += rescale_intercept

    maximum_value = np.amax(pixel_data_float)
    minimum_value = np.amin(pixel_data_float)

    pixel_data_float_scaled = (
        np.maximum(pixel_data_float, 0) / pixel_data_float.max(initial=0) * 255.0
    )
    pixel_data_uint8_scaled = np.uintc(pixel_data_float_scaled)

    SliceLocation = getDicomValue(ds, "SliceLocation")
    ImageOrientationPatient = getDicomValue(ds, "ImageOrientationPatient")
    ImagePositionPatient = getDicomValue(ds, "ImagePositionPatient")
    InstanceNumber = getDicomValue(ds, "InstanceNumber")

    PixelSpacing = getDicomValue(ds, "PixelSpacing")
    Modality = getDicomValue(ds, "Modality")
    SeriesDescription = getDicomValue(ds, "SeriesDescription")
    ProtocolName = getDicomValue(ds, "ProtocolName")
    PatientName = getDicomValue(ds, "PatientName")
    StudyDate = getDicomValue(ds, "StudyDate")
    StudyTime = getDicomValue(ds, "StudyTime")
    SliceThickness = getDicomValue(ds, "SliceThickness")
    SpacingBetweenSlices = getDicomValue(ds, "SpacingBetweenSlices")
    RepetitionTime = getDicomValue(ds, "RepetitionTime")
    EchoTime = getDicomValue(ds, "EchoTime")
    ImageType = getDicomValue(ds, "ImageType")
    MagneticFieldStrength = getDicomValue(ds, "MagneticFieldStrength")
    SeriesNumber = getDicomValue(ds, "SeriesNumber")
    NumberOfFrames = getDicomValue(ds, "NumberOfFrames")
    StudyDescription = getDicomValue(ds, "StudyDescription")

    output_json = {
        "slices": [
            {
                "image": pixel_data_uint8_scaled.tolist(),
                "InstanceNumber": InstanceNumber,
                "SliceLocation": SliceLocation,
                "ImageOrientationPatient": ImageOrientationPatient,
                "ImagePositionPatient": ImagePositionPatient,
                "filepath": filepath,
            }
        ],
        "width": ds.Columns,
        "height": ds.Rows,
        "minimum": float(minimum_value),
        "maximum": float(maximum_value),
        "Modality": Modality,
        "SeriesDescription": SeriesDescription,
        "PatientName": PatientName,
        "StudyDate": StudyDate,
        "StudyTime": StudyTime,
        "SliceThickness": SliceThickness,
        "SpacingBetweenSlices": SpacingBetweenSlices,
        "ProtocolName": ProtocolName,
        "RepetitionTime": RepetitionTime,
        "EchoTime": EchoTime,
        "MagneticFieldStrength": MagneticFieldStrength,
        "SeriesNumber": SeriesNumber,
        "NumberOfFrames": NumberOfFrames,
        "PixelSpacing": PixelSpacing,
        "ImageType": ImageType,
        "StudyDescription": StudyDescription,
    }

    return output_json


def main():
    parser = argparse.ArgumentParser(description="Convert DICOM file to JSON format.")
    # parser.add_argument(
    #     "filepath",
    #     help="Path to the DICOM file",
    #     nargs="?",  # This makes the argument optional 
    #     default=r"C:\Users\Dell 5591\Documents\freelance\homeAssigmentUniversityHospitalBern\dicom_examples\Images\A\MR-IMG-301-1-130.dcm",
    # )
    parser.add_argument(
        "filepath",
        help="Path to the DICOM file"
    )
    args = parser.parse_args()

    # print(args.filepath)
    dicom_data = convert_dicom(args.filepath)
    dicom_data_json = json.dumps(dicom_data)
    print(dicom_data_json)
    # return dicom_data_json


if __name__ == "__main__":
    main()
