# Generic Master Data Management System (MDMS)

A flexible and powerful Master Data Management System built with TypeORM and PostgreSQL that provides:

🔄 CRUD operations on any master data type (products, users, projects, etc.)

📤 Multiple Excel uploads per type — each upload creates a new version

🔧 Each version is editable via APIs

🏷️ Versions can be tagged for easy reference

🔍 Searchable using type ID + version or tag

## Core Concepts

| Concept | Description |
|---------|-------------|
| Master Data Type | Entity like Product, User, Project with unique name and description |
| Version | Each data upload or API creation generates a new version with its own schema |
| Tag | Labels like "latest", "prod", "test" that can be mapped to specific versions |
| Record | Individual data entries stored within a version with flexible JSON structure |

## High-Level Architecture

```
+------------------+      +--------------------+      +--------------------+
|   Frontend UI    | ---> |   MDM API Gateway  | ---> |   MDM Core Service |
+------------------+      +--------------------+      +--------------------+
                                                           |
                                                +----------------------+
                                                |     PostgreSQL       |
                                                |    (JSONB Fields)    |
                                                +----------------------+
```

## API Documentation

Detailed API documentation with examples is available in the following files:

- [Master Data Types Management](curl/master-data-types.md)
- [Version Management](curl/version-management.md)
- [Record Management](curl/record-management.md)
- [Excel Upload Operations](curl/excel-upload.md)

## Postman Collection

A comprehensive Postman collection is available for testing all API endpoints. Import the following file into Postman:

- [MDM Service Postman Collection](MDM_Service.postman_collection.json)

## Data Model

### 🔷 master_data_types
Stores metadata of each master data type.

```typescript
{
  id: string;          // UUID
  name: string;        // Unique name (indexed)
  description: string; // Optional description
  createdAt: Date;     // Creation timestamp
  versions: MasterDataVersion[]; // One-to-many relationship with versions
}
```

### 🔷 master_data_versions
Each version corresponds to a dataset uploaded or created via API.

```typescript
{
  id: string;          // UUID
  version: number;      // Version number
  tagList: string[];    // Array of tags (e.g., ["latest", "prod"])
  fields: string[];     // Schema fields for this version
  createdAt: Date;     // Creation timestamp
  masterDataType: MasterDataType; // Many-to-one relationship with type
  records: MasterDataRecord[];    // One-to-many relationship with records
}
```

### 🔷 master_data_records
Stores the actual data records for each version.

```typescript
{
  id: string;          // UUID
  data: object;        // Flexible JSON data structure (JSONB)
  createdAt: Date;     // Creation timestamp
  version: MasterDataVersion; // Many-to-one relationship with version
}
```

## Features

- **Type Management**: Create and manage different types of master data with unique names and descriptions
- **Version Control**: Each data upload or API creation generates a new version with its own schema definition
- **Tagging System**: Flexible tagging system for versions (e.g., "latest", "prod", "test") for easy reference and retrieval
- **Excel Upload**: Bulk import data from Excel files with automatic schema detection
- **Flexible Schema**: Each version maintains its own field structure using fields array
- **CRUD Operations**: Complete API support for managing types, versions, and records
- **JSON Storage**: Efficient storage using PostgreSQL JSONB fields with indexing support

## Setup and Configuration

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- TypeScript

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=mdm_service
```

4. Build and start the service:
```bash
npm run build
npm start
```

## Usage Examples

### Creating a Master Data Type
```bash
curl -X POST http://localhost:3000/api/mdm/types \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product",
    "description": "Product catalog master data"
  }'
```

### Creating a Version with Schema
```bash
curl -X POST http://localhost:3000/api/mdm/types/{mdmId}/versions \
  -H "Content-Type: application/json" \
  -d '{
    "fields": ["name", "sku", "price", "category"]
  }'
```

### Adding Records to a Version
```bash
curl -X POST http://localhost:3000/api/mdm/records \
  -H "Content-Type: application/json" \
  -d '{
    "versionId": "your-version-id",
    "data": {
      "name": "Product A",
      "sku": "SKU001",
      "price": 99.99,
      "category": "Electronics"
    }
  }'
```
```

