# MDM Service API Testing Guide

This document provides curl commands for testing the Master Data Management (MDM) Service API endpoints.

## Master Data Type Operations

### Create Master Data Type
```bash
curl -X POST http://localhost:3000/api/mdm/types \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer",
    "description": "Customer master data"
  }'
```

### Get All Master Data Types
```bash
curl -X GET http://localhost:3000/api/mdm/types
```

### Get Master Data Type by ID
```bash
curl -X GET http://localhost:3000/api/mdm/types/{mdmId}
```

### Update Master Data Type
```bash
curl -X PUT http://localhost:3000/api/mdm/types/{mdmId} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Customer",
    "description": "Updated customer master data"
  }'
```

### Delete Master Data Type
```bash
curl -X DELETE http://localhost:3000/api/mdm/types/{mdmId}
```

## Master Data Version Operations

### Get All Versions for a Master Data Type
```bash
curl -X GET http://localhost:3000/api/mdm/types/{mdmId}/versions
```

### Get Version by ID
```bash
curl -X GET http://localhost:3000/api/mdm/versions/{versionId}
```

### Get Latest Version
```bash
curl -X GET http://localhost:3000/api/mdm/types/{mdmId}/versions/latest
```

## Master Data Records Operations

### Get Records for a Version
```bash
curl -X GET http://localhost:3000/api/mdm/versions/{versionId}/records
```

### Get Record by ID
```bash
curl -X GET http://localhost:3000/api/mdm/records/{recordId}
```

## Excel Upload

### Upload Excel File
```bash
curl -X POST http://localhost:3000/api/mdm/types/{mdmId}/upload \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/excel/file.xlsx"
```

Note: Replace the following placeholders with actual values:
- `{mdmId}`: ID of the master data type
- `{versionId}`: ID of the master data version
- `{recordId}`: ID of the master data record
- `/path/to/your/excel/file.xlsx`: Path to your local Excel file

All responses will be in JSON format. Successful responses will have appropriate HTTP status codes (200 for GET, 201 for POST, etc.).