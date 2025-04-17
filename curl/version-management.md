# Version Management API Documentation

This document provides curl commands for testing the Version Management API endpoints.

## Create Version
```bash
curl -X POST http://localhost:3000/api/mdm/types/{mdmId}/versions \
  -H "Content-Type: application/json" \
  -d '{"fields": ["name", "code", "description"]}'
```

Example Response:
```json
{
  "id": "1234567890",
  "version": "1.0.0",
  "description": "Initial version",
  "mdmId": "mdm123",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Create Version with Data
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

Example Response:
```json
{
  "id": "1234567890",
  "version": "1.0.0",
  "description": "Initial version",
  "mdmId": "mdm123",
  "records": [
    {
      "id": "rec123",
      "data": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Get All Versions for a Master Data Type
```bash
curl -X GET http://localhost:3000/api/mdm/types/{mdmId}/versions
```

Example Response:
```json
[
  {
    "id": "1234567890",
    "version": "1.0.0",
    "description": "Initial version",
    "mdmId": "mdm123",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

## Get Version by ID
```bash
curl -X GET http://localhost:3000/api/mdm/versions/{versionId}
```

Example Response:
```json
{
  "id": "1234567890",
  "version": "1.0.0",
  "description": "Initial version",
  "mdmId": "mdm123",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Get Version by Version Number
```bash
curl -X GET http://localhost:3000/api/mdm/types/{mdmId}/versions/{version}
```

Example Response:
```json
{
  "id": "1234567890",
  "version": "1.0.0",
  "description": "Initial version",
  "mdmId": "mdm123",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Get Version by Tag
```bash
curl -X GET http://localhost:3000/api/mdm/types/{mdmId}/versions/tag/{tag}
```

Example Response:
```json
{
  "id": "1234567890",
  "version": "1.0.0",
  "description": "Initial version",
  "mdmId": "mdm123",
  "tags": ["production"],
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Add Tag to Version
```bash
curl -X POST http://localhost:3000/api/mdm/versions/{versionId}/tags \
  -H "Content-Type: application/json" \
  -d '{
    "tag": "production"
  }'
```

Example Response:
```json
{
  "id": "1234567890",
  "version": "1.0.0",
  "description": "Initial version",
  "mdmId": "mdm123",
  "tags": ["production"],
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Remove Tag from Version
```bash
curl -X DELETE http://localhost:3000/api/mdm/versions/{versionId}/tags/{tag}
```

Example Response:
```json
{
  "message": "Tag removed successfully"
}
```

Note: Replace the following placeholders with actual values:
- `{mdmId}`: ID of the master data type
- `{versionId}`: ID of the version
- `{version}`: Version number (e.g., "1.0.0")
- `{tag}`: Tag name (e.g., "production")