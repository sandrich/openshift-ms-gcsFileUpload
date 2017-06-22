# openshift-ms-gcsFileUpload
This package offers a REST Api to upload a file to Google Cloud Storage

## TODO
* Tests
* File upload to GCS
* OpenShift template

## Environment variables
**GCS_PROJECT (required)**
Google Project ID

**GCS_KEY_FILENAME (required)**
Name of the keyfile.json file

**GCS_BUCKET (required)**
Bucket name

## Routes
**GET /healthz**
Returns health information

**PUT /upload**
Will upload the file to GCS. It will generate a UUID filename unless specified differently with query parameters.

**PUT /upload?fileName=**
Will upload the file to GCS with the specified file name

**PUT /upload?fileExtension=**
Will upload the file to GCS with a random UUID name and given extension.
