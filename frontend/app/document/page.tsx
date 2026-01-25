"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import { columns, FileDocument } from "./columns"
import { Button } from "@/components/ui/button"
import { Upload, Plus, Download, Trash2 } from "lucide-react"

const mockData: FileDocument[] = [
  {
    id: "1",
    name: "Documents",
    type: "Folder",
    size: 0,
    createdBy: "John Doe",
    createdAt: new Date("2024-01-15"),
    isFolder: true,
  },
  {
    id: "2",
    name: "Budget Report.xlsx",
    type: "Excel",
    size: 512000,
    createdBy: "Jane Smith",
    createdAt: new Date("2024-01-20"),
    isFolder: false,
  },
  {
    id: "3",
    name: "Meeting Notes.docx",
    type: "Word",
    size: 102400,
    createdBy: "Mike Johnson",
    createdAt: new Date("2024-01-18"),
    isFolder: false,
  },
  {
    id: "4",
    name: "Projects",
    type: "Folder",
    size: 0,
    createdBy: "Sarah Williams",
    createdAt: new Date("2024-01-22"),
    isFolder: true,
  },
  {
    id: "5",
    name: "Contract.pdf",
    type: "PDF",
    size: 1536000,
    createdBy: "John Doe",
    createdAt: new Date("2024-01-10"),
    isFolder: false,
  },
  {
    id: "6",
    name: "Invoice_2024.pdf",
    type: "PDF",
    size: 256000,
    createdBy: "Jane Smith",
    createdAt: new Date("2024-01-25"),
    isFolder: false,
  },
  {
    id: "7",
    name: "Archives",
    type: "Folder",
    size: 0,
    createdBy: "Admin",
    createdAt: new Date("2023-12-01"),
    isFolder: true,
  },
  {
    id: "8",
    name: "Design_Mockup.fig",
    type: "Figma",
    size: 3145728,
    createdBy: "Sarah Williams",
    createdAt: new Date("2024-01-23"),
    isFolder: false,
  },
]

export default function DocumentManagementPage() {
  const [data, setData] = useState<FileDocument[]>(mockData)
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const handleUpload = () => {
    console.log("Upload new file")
  }

  const handleCreateNew = () => {
    console.log("Create new document")
  }

  const handleBulkDelete = () => {
    console.log("Delete selected files:", selectedRows)
    setData(data.filter((file) => !selectedRows.includes(file.id)))
    setSelectedRows([])
  }

  const handleBulkDownload = () => {
    console.log("Download selected files:", selectedRows)
  }

  const handleBulkArchive = () => {
    console.log("Archive selected files:", selectedRows)
    setData(
      data.map((file) =>
        selectedRows.includes(file.id) ? { ...file, status: "archived" as const } : file
      )
    )
    setSelectedRows([])
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize your files and documents
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleUpload} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Folder
          </Button>
        </div>
      </div>

      {selectedRows.length > 0 && (
        <div className="mb-4 rounded-lg border bg-muted p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {selectedRows.length} file(s) selected
              </span>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleBulkDownload} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button onClick={handleBulkArchive} variant="outline" size="sm">
                Archive
              </Button>
              <Button onClick={handleBulkDelete} variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <DataTable
            columns={columns}
            data={data}
            searchKey="name"
            searchPlaceholder="Search"
            onSelectionChange={setSelectedRows}
          />
        </div>
      </div>
    </div>
  )
}

function formatTotalSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}
