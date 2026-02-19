export type NodeType = "folder" | "file";

export interface BaseNode {
    id: string;              // uuid
    name: string;
    parentId: string | null; // null = root of DataRoom
    dataRoomId: string;      // which DataRoom it belongs to
    createdAt: number;       // timestamp (ms)
    updatedAt: number;       // timestamp (ms)
    type: NodeType;
}

export interface FolderNode extends BaseNode {
    type: "folder";
}

export interface FileNode extends BaseNode {
    type: "file";
    mimeType: string;          // 'application/pdf'
    size: number;              // bytes
    blobKey: string;           // key in IndexedDB for storing blobs separately
}

export type FileSystemNode = FolderNode | FileNode;

// DataRoom is simply a root container.
export interface DataRoom {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
}