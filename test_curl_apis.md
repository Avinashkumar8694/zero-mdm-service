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

### Create Version
```bash
curl -X POST http://localhost:3000/api/mdm/types/{mdmId}/versions \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0.0",
    "description": "Initial version"
  }'
```

### Create Version with Data
```bash
curl -X POST http://localhost:3000/api/mdm/types/{mdmId}/versions-with-data \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0.0",
    "description": "Initial version",
    "records": [
      {
        "data": {
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ]
  }'
```

### Get All Versions for a Master Data Type
```bash
curl -X GET http://localhost:3000/api/mdm/types/{mdmId}/versions
```

### Get Version by ID
```bash
curl -X GET http://localhost:3000/api/mdm/versions/{versionId}
```

### Get Version by Version Number
```bash
curl -X GET http://localhost:3000/api/mdm/types/{mdmId}/versions/{version}
```

### Get Version by Tag
```bash
curl -X GET http://localhost:3000/api/mdm/types/{mdmId}/versions/tag/{tag}
```

### Add Tag to Version
```bash
curl -X POST http://localhost:3000/api/mdm/versions/{versionId}/tags \
  -H "Content-Type: application/json" \
  -d '{
    "tag": "production"
  }'
```

### Remove Tag from Version
```bash
curl -X DELETE http://localhost:3000/api/mdm/versions/{versionId}/tags/{tag}
```

## Master Data Records Operations

### Create Record
To create a new record, you must provide both the versionId and the record data:

```bash
curl -X POST http://localhost:3000/api/mdm/records \
  -H "Content-Type: application/json" \
  -d '{
    "versionId": "your-version-id",
    "data": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }'
```

Note: The versionId must correspond to an existing master data version.
```

### Create Record with Version
```bash
curl -X POST http://localhost:3000/api/mdm/types/{mdmId}/versions/{version}/records \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }'
```

### Get Records for a Version
```bash
curl -X GET http://localhost:3000/api/mdm/versions/{versionId}/records
```

### Get Record by ID
```bash
curl -X GET http://localhost:3000/api/mdm/records/{recordId}
```

### Update Record
```bash
curl -X PUT http://localhost:3000/api/mdm/records/{recordId} \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "Updated John Doe",
      "email": "john.updated@example.com"
    }
  }'
```

### Update Record with Version
```bash
curl -X PUT http://localhost:3000/api/mdm/types/{mdmId}/versions/{version}/records/{recordId} \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "Updated John Doe",
      "email": "john.updated@example.com"
    }
  }'
```

### Delete Record
```bash
curl -X DELETE http://localhost:3000/api/mdm/records/{recordId}
```

### Delete Record with Version
```bash
curl -X DELETE http://localhost:3000/api/mdm/types/{mdmId}/versions/{version}/records/{recordId}
```

### Search Records in Version
```bash
curl -X GET "http://localhost:3000/api/mdm/versions/{versionId}/records/search?query=john"
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
- `{version}`: Version number (e.g., "1.0.0")
- `{recordId}`: ID of the master data record
- `{tag}`: Version tag name
- `/path/to/your/excel/file.xlsx`: Path to your local Excel file

All responses will be in JSON format. Successful responses will have appropriate HTTP status codes (200 for GET, 201 for POST, etc.).