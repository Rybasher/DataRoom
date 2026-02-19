# DataRoom

A virtual Data Room MVP for secure document storage and management, built with React, TypeScript, and Vite. Supports nested folders, PDF file uploads with in-browser storage, full CRUD operations, and a polished file-system UI.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠 Tech Stack

| Layer | Library / Version |
|---|---|
| **Frontend** | React 19.2, TypeScript 5.9 |
| **Build Tool** | Vite 7.3 |
| **UI Components** | Shadcn UI + Radix UI |
| **Styling** | Tailwind CSS 4.1 |
| **Server State** | TanStack Query 5.90 |
| **Routing** | React Router 7.13 |
| **Database** | Dexie.js 4.3 (IndexedDB wrapper) |
| **Forms** | React Hook Form 7.71 + Zod 4.3 |
| **PDF Preview** | react-pdf 10.3 + pdfjs-dist |
| **File Upload** | react-dropzone 15.0 |
| **Dates** | Day.js 1.11 |
| **Notifications** | Sonner 2.0 |

## 📁 Project Structure

```
src/
├── components/          # Shared UI components (Shadcn)
│   └── ui/              # Button, Dialog, Table, Skeleton, etc.
├── constants/           # App-wide constants
│   └── file-system.ts   # File size limits, allowed types, name rules
├── features/            # Feature-based modules
│   ├── data-room/       # Data room management
│   │   ├── api/         # CRUD repository
│   │   ├── components/  # Cards, list, dialogs, toolbar, skeletons
│   │   ├── hooks/       # useDataRooms, useCreateDataRoom, etc.
│   │   ├── queries.ts   # TanStack Query options
│   │   └── validation/  # Zod schemas
│   ├── file/            # File operations
│   │   ├── api/         # file-repository (upload, rename, delete)
│   │   ├── components/  # UploadFiles, FileDropZone, FilePreview, RenameFile, DeleteFile
│   │   └── hooks/       # useUploadFiles, useRenameFile, useDeleteFile, useDropZone, useFileBlobUrl
│   ├── file-system/     # Shared file-system layer
│   │   ├── api/         # node-repository, blob-repository
│   │   ├── components/  # NodeList, NodeListSkeleton
│   │   ├── hooks/       # useNodes
│   │   ├── queries.ts   # nodeQueries
│   │   └── validation/  # File and name validation
│   └── folder/          # Folder operations
│       ├── api/         # folder-repository
│       ├── components/  # CreateFolder, RenameFolder, DeleteFolder
│       ├── hooks/       # useCreateFolder, useRenameFolder, useDeleteFolder, etc.
│       ├── queries.ts   # folderQueries
│       └── validation/  # Zod schemas
├── layouts/             # App shell layouts
│   └── data-room-layout.tsx  # Sidebar + main content
├── lib/                 # Utilities and services
│   ├── db/              # Dexie database schema and instance
│   ├── errors.ts        # Custom error classes
│   ├── pdf.ts           # pdf.js worker initialization
│   └── utils/           # formatters.ts, name-resolver.ts
├── pages/               # Route pages
│   ├── home-page.tsx    # Data room grid
│   └── data-room-page.tsx  # File-system browser
├── providers/           # React context providers
├── router/              # TanStack Router config
└── types/               # TypeScript definitions
    ├── core.ts          # DataRoom, FileSystemNode, FolderNode, FileNode
    ├── guards.ts        # isFolderNode, isFileNode
    └── sort.ts          # SortOption type
```

## 🔧 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (localhost:5173) |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |

## 🗄 Data Model

All data is stored in the browser via **IndexedDB** (Dexie.js) — no backend required.

```
DataRoomDB
├── dataRooms   { id, name, createdAt, updatedAt }
├── nodes       { id, name, parentId, dataRoomId, type, createdAt, updatedAt,
│                 ...FileNode: mimeType, size, blobKey }
└── blobs       { key, data: Blob }
```

**Key design decisions:**
- Folders and files share a single `nodes` table — unified queries, no JOIN-equivalent overhead
- `parentId: null` means the node sits at the root of a Data Room
- File binary data is stored separately in the `blobs` table keyed by `blobKey` — keeps metadata queries fast
- Cascade delete: deleting a folder recursively removes all children and their blobs

```typescript
// core.ts
export interface FolderNode extends BaseNode { type: "folder" }
export interface FileNode extends BaseNode {
    type: "file";
    mimeType: string;   // "application/pdf"
    size: number;       // bytes
    blobKey: string;    // reference to blobs table
}
export type FileSystemNode = FolderNode | FileNode;
```

## 📂 Features

### Data Rooms
- Create, rename, and delete Data Rooms
- Active room is pinned to the top of the sidebar and visually highlighted
- Deleting the currently open room auto-redirects to the next available one

### Folders
- Create nested folders at any depth
- Rename with duplicate-name validation
- Delete recursively (all nested folders and files are removed)
- Breadcrumb navigation for deep folder traversal

### Files
- Upload one or multiple PDF files via button or drag-and-drop
- Rename files (duplicate-name validation applied)
- Delete files (associated blob removed automatically)
- Full-screen PDF preview with page navigation and keyboard shortcuts (`←/→` pages, `Esc` close)

### Edge Cases Handled
| Scenario | Behaviour |
|---|---|
| Uploading a file with a duplicate name | Auto-renamed OS-style: `report.pdf` → `report (1).pdf` |
| Creating a folder with a duplicate name | `DuplicateNameError` shown in the form |
| Uploading a non-PDF file | `InvalidFileTypeError` — rejected before storage |
| File exceeds 50 MB | `FileSizeExceededError` — rejected before storage |
| Node creation fails after blob is stored | Orphaned blob is cleaned up automatically |
| Deleting a folder with deep nesting | Full recursive cascade delete including all blobs |

## 🧩 State Management

### Server State — TanStack Query
All async data (data rooms, nodes) is managed through TanStack Query with centralised `queryOptions` factories:

```typescript
// features/file-system/queries.ts
export const nodeQueries = {
    key: ["NODE"],
    children: (parentId, dataRoomId, sortBy) =>
        queryOptions({
            queryKey: [...nodeQueries.key, dataRoomId, parentId ?? "root", sortBy],
            queryFn: () => getChildren(parentId, dataRoomId, sortBy),
            staleTime: 1000 * 60 * 5,
        }),
};
```

Mutations invalidate `nodeQueries.key` to keep the UI in sync across all operations.

## 📋 Forms & Validation

React Hook Form + Zod with shared schemas:

```typescript
// features/folder/validation/folder-schema.ts
export const folderSchema = z.object({
    name: z
        .string()
        .min(1, "Name must be at least 1 character")
        .max(255, "Name cannot exceed 255 characters")
        .refine((name) => !INVALID_NAME_CHARACTERS.some((c) => name.includes(c)), {
            message: `Name cannot contain: / \\ : * ? " < > |`,
        }),
});
```

The same schema is reused for both folder and file rename dialogs.

## 🎨 UI Highlights

- **Skeleton loaders** replace all text-based loading states
- **Drag-and-drop** zone covers the full scroll area with visual overlays for valid / rejected states
- **NodeList** renders a single unified table for folders and files, using type guards to switch between `FolderRow` and `FileRow`
- All list rows and their parent component are wrapped in `React.memo`; callbacks in the page are stabilised with `useCallback`
- **PDF preview** uses a responsive `ResizeObserver` to fill the panel width, with annotation and text layers enabled

## 🔨 Development Guidelines

### Adding a New Feature
1. Create `src/features/[feature-name]/`
2. Add the API layer in `api/` (repository functions calling Dexie)
3. Define TanStack Query options in `queries.ts`
4. Create mutation/query hooks in `hooks/`
5. Build UI components in `components/`
6. Add Zod validation schemas in `validation/`
7. Place shared type definitions in `src/types/`; shared utilities in `src/lib/utils/`

### Naming Conventions
- Repository functions: `getX`, `createX`, `renameX`, `deleteX`
- Query hooks: `useXs` (list), `useX` (single)
- Mutation hooks: `useCreateX`, `useRenameX`, `useDeleteX`
- Query keys follow the pattern `["ENTITY"]` for easy wildcard invalidation

### File Constraints
| Setting | Value |
|---|---|
| Allowed types | `application/pdf` only |
| Max file size | 50 MB |
| Max name length | 255 characters |
| Invalid name chars | `/ \ : * ? " < > \|` |
