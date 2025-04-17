# Excel Upload API Documentation

This document provides curl commands for testing the Excel Upload API endpoints.

## Upload Excel File
```bash
curl -X POST http://localhost:3000/api/mdm/types/{mdmId}/upload \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/excel/file.xlsx"
```

Example Response:
```json
{
  "message": "File uploaded and processed successfully",
  "records": [
    {
      "id": "rec123",
      "versionId": "ver123",
      "data": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

Note: 
- Replace `{mdmId}` with the actual ID of the master data type
- Replace `/path/to/your/excel/file.xlsx` with the actual path to your Excel file
- The Excel file should follow the required format for the specified master data type