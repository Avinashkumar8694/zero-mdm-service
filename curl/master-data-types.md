# Master Data Type API Documentation

This document provides curl commands for testing the Master Data Type API endpoints.

## Create Master Data Type
```bash
curl -X POST http://localhost:3000/api/mdm/types \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer",
    "description": "Customer master data"
  }'
```

Example Response:
```json
{
  "id": "1234567890",
  "name": "Customer",
  "description": "Customer master data",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Get All Master Data Types
```bash
curl -X GET http://localhost:3000/api/mdm/types
```

Example Response:
```json
[
  {
    "id": "1234567890",
    "name": "Customer",
    "description": "Customer master data",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

## Get Master Data Type by ID
```bash
curl -X GET http://localhost:3000/api/mdm/types/{mdmId}
```

Example Response:
```json
{
  "id": "1234567890",
  "name": "Customer",
  "description": "Customer master data",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Update Master Data Type
```bash
curl -X PUT http://localhost:3000/api/mdm/types/{mdmId} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Customer",
    "description": "Updated customer master data"
  }'
```

Example Response:
```json
{
  "id": "1234567890",
  "name": "Updated Customer",
  "description": "Updated customer master data",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Delete Master Data Type
```bash
curl -X DELETE http://localhost:3000/api/mdm/types/{mdmId}
```

Example Response:
```json
{
  "message": "Master data type deleted successfully"
}
```

Note: Replace `{mdmId}` with the actual ID of the master data type you want to operate on.