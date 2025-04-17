# Record Management API Documentation

This document provides curl commands for testing the Record Management API endpoints.

## Create Record
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

Example Response:
```json
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
```

## Create Record with Version
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

Example Response:
```json
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
```

## Get Records for a Version
```bash
curl -X GET http://localhost:3000/api/mdm/versions/{versionId}/records
```

Example Response:
```json
[
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
```

## Get Record by ID
```bash
curl -X GET http://localhost:3000/api/mdm/records/{recordId}
```

Example Response:
```json
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
```

## Update Record
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

Example Response:
```json
{
  "id": "rec123",
  "versionId": "ver123",
  "data": {
    "name": "Updated John Doe",
    "email": "john.updated@example.com"
  },
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Update Record with Version
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

Example Response:
```json
{
  "id": "rec123",
  "versionId": "ver123",
  "data": {
    "name": "Updated John Doe",
    "email": "john.updated@example.com"
  },
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Delete Record
```bash
curl -X DELETE http://localhost:3000/api/mdm/records/{recordId}
```

Example Response:
```json
{
  "message": "Record deleted successfully"
}
```

## Delete Record with Version
```bash
curl -X DELETE http://localhost:3000/api/mdm/types/{mdmId}/versions/{version}/records/{recordId}
```

Example Response:
```json
{
  "message": "Record deleted successfully"
}
```

## Search Records in Version
```bash
curl -X GET "http://localhost:3000/api/mdm/versions/{versionId}/records/search?query=john"
```

Example Response:
```json
[
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
```

Note: Replace the following placeholders with actual values:
- `{mdmId}`: ID of the master data type
- `{versionId}`: ID of the version
- `{version}`: Version number (e.g., "1.0.0")
- `{recordId}`: ID of the record