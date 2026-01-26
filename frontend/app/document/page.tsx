"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import { DataTable } from "@/components/data-table";
import { createColumns, FileDocument } from "./columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Plus, Download, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { getDocuments, createFolder, uploadFile, deleteDocument } from "@/services/document.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// const mockData: FileDocument[] = [
//   {
//     id: "1",
//     name: "Documents",
//     type: "Folder",
//     size: 0,
//     createdBy: "John Doe",
//     createdAt: new Date("2024-01-15"),
//     isFolder: true,
//   },
//   {
//     id: "2",
//     name: "Budget Report.xlsx",
//     type: "Excel",
//     size: 512000,
//     createdBy: "Jane Smith",
//     createdAt: new Date("2024-01-20"),
//     isFolder: false,
//   },
//   {
//     id: "3",
//     name: "Meeting Notes.docx",
//     type: "Word",
//     size: 102400,
//     createdBy: "Mike Johnson",
//     createdAt: new Date("2024-01-18"),
//     isFolder: false,
//   },
//   {
//     id: "4",
//     name: "Projects",
//     type: "Folder",
//     size: 0,
//     createdBy: "Sarah Williams",
//     createdAt: new Date("2024-01-22"),
//     isFolder: true,
//   },
//   {
//     id: "5",
//     name: "Contract.pdf",
//     type: "PDF",
//     size: 1536000,
//     createdBy: "John Doe",
//     createdAt: new Date("2024-01-10"),
//     isFolder: false,
//   },
//   {
//     id: "6",
//     name: "Invoice_2024.pdf",
//     type: "PDF",
//     size: 256000,
//     createdBy: "Jane Smith",
//     createdAt: new Date("2024-01-25"),
//     isFolder: false,
//   },
//   {
//     id: "7",
//     name: "Archives",
//     type: "Folder",
//     size: 0,
//     createdBy: "Admin",
//     createdAt: new Date("2023-12-01"),
//     isFolder: true,
//   },
//   {
//     id: "8",
//     name: "Design_Mockup.fig",
//     type: "Figma",
//     size: 3145728,
//     createdBy: "Sarah Williams",
//     createdAt: new Date("2024-01-23"),
//     isFolder: false,
//   },
// ]

export default function DocumentManagementPage() {
  const [data, setData] = useState<FileDocument[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalCreateFolder, setIsModalCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [sorting, setSorting] = useState({
    sortBy: 'name',
    sortOrder: 'asc' as 'asc' | 'desc',
  });
  const [search, setSearch] = useState('');
  const [alertDialog, setAlertDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    type?: "success" | "error";
  }>({ open: false, title: "", description: "" });
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });

  const handlePaginationChange = useCallback((page: number, pageSize: number) => {
    setPagination(prev => ({ ...prev, page, limit: pageSize }));
  }, []);

  const handleSortingChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setSorting({ sortBy, sortOrder });
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 when sorting changes
  }, []);

  const handleSearchChange = useCallback((searchValue: string) => {
    setSearch(searchValue);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 when search changes
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await getDocuments(
          pagination.page,
          pagination.limit,
          sorting.sortBy,
          sorting.sortOrder,
          search
        );
        const res = response.data; // Backend wraps response in data property
        setData(res.data);
        setPagination(prev => ({
          ...prev,
          total: res.total,
          totalPages: res.totalPages,
        }));
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      }
    };

    fetchDocuments();
  }, [pagination.page, pagination.limit, sorting.sortBy, sorting.sortOrder, search])

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name);
        formData.append('type', file.type || 'application/octet-stream');
        formData.append('size', file.size.toString());
        formData.append('userId', '1');

        await uploadFile(formData);
      }

      setAlertDialog({
        open: true,
        title: "Success",
        description: `${files.length} file(s) uploaded successfully`,
        type: "success",
      });

      const response = await getDocuments(
        pagination.page, 
        pagination.limit,
        sorting.sortBy,
        sorting.sortOrder
      );
      const res = response.data;
      setData(res.data);
      setPagination(prev => ({
        ...prev,
        total: res.total,
        totalPages: res.totalPages,
      }));
    } catch (error: any) {
      setAlertDialog({
        open: true,
        title: "Error",
        description: error.response?.data?.message || "Failed to upload files",
        type: "error",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  const handleCreateNew = () => {
    setFolderName("");
    setIsModalCreateFolder(true);
  };

  const handleCreateFolder = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!folderName.trim()) {
      setAlertDialog({
        open: true,
        title: "Validation Error",
        description: "Please enter a folder name",
        type: "error",
      });
      return;
    }

    try {
      await createFolder({
        name: folderName,
        type: "folder",
        userId: 1,
      });

      setIsModalCreateFolder(false);
      setFolderName("");

      setAlertDialog({
        open: true,
        title: "Success",
        description: `Folder created successfully`,
        type: "success",
      });

      const response = await getDocuments(
        pagination.page, 
        pagination.limit,
        sorting.sortBy,
        sorting.sortOrder
      );
      const res = response.data;
      setData(res.data);
      setPagination(prev => ({
        ...prev,
        total: res.total,
        totalPages: res.totalPages,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to create folder";
      setAlertDialog({
        open: true,
        title: "Error",
        description: errorMessage,
        type: "error",
      });
    }
  }

  const handleDelete = async (id: string) => {
    setDeleteConfirmDialog({ open: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmDialog.id) return;

    try {
      await deleteDocument(deleteConfirmDialog.id);

      setDeleteConfirmDialog({ open: false, id: null });

      setAlertDialog({
        open: true,
        title: "Success",
        description: "File deleted successfully",
        type: "success",
      });

      const response = await getDocuments(
        pagination.page, 
        pagination.limit,
        sorting.sortBy,
        sorting.sortOrder
      );
      const res = response.data;
      setData(res.data);
      setPagination(prev => ({
        ...prev,
        total: res.total,
        totalPages: res.totalPages,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete file";

      setDeleteConfirmDialog({ open: false, id: null });

      setAlertDialog({
        open: true,
        title: "Error",
        description: errorMessage,
        type: "error",
      });
    }
  };

  const handleBulkDelete = () => {
    console.log("Delete selected files:", selectedRows);
    setData(data.filter((file) => !selectedRows.includes(file.id)));
    setSelectedRows([]);
  }

  const handleBulkDownload = () => {
    console.log("Download selected files:", selectedRows);
  }

  const handleBulkArchive = () => {
    console.log("Archive selected files:", selectedRows);
    setData(
      data.map((file) =>
        selectedRows.includes(file.id) ? { ...file, status: "archived" as const } : file
      )
    );
    setSelectedRows([]);
  }

  return (
    <div className="container mx-auto py-10">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg"
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize your files and documents
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleUpload} variant="outline" disabled={isUploading}>
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload File"}
          </Button>
          <Button onClick={handleCreateNew} className="hover:bg-primary hover:brightness-75">
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
            columns={createColumns(handleDelete)}
            data={data}
            searchKey="name"
            searchPlaceholder="Search"
            onSelectionChange={setSelectedRows}
            manualPagination={true}
            pageCount={pagination.totalPages}
            pageIndex={pagination.page - 1}
            pageSize={pagination.limit}
            totalRows={pagination.total}
            onPaginationChange={handlePaginationChange}
            onSortingChange={handleSortingChange}
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>

      <AlertDialog open={isModalCreateFolder} onOpenChange={setIsModalCreateFolder}>
        <AlertDialogContent>
          <form onSubmit={handleCreateFolder}>
            <AlertDialogHeader>
              <AlertDialogTitle>Create New Folder</AlertDialogTitle>
              <AlertDialogDescription>
                Enter a name for your new folder
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Input
                placeholder="Folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                autoFocus
                required
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel type="button" onClick={() => setFolderName("")}>Cancel</AlertDialogCancel>
              <Button type="submit">Create</Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteConfirmDialog.open} onOpenChange={(open) => setDeleteConfirmDialog({ ...deleteConfirmDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the file or folder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmDialog({ open: false, id: null })}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={alertDialog.open} onOpenChange={(open) => setAlertDialog({ ...alertDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              {alertDialog.type === "success" ? (
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              ) : alertDialog.type === "error" ? (
                <XCircle className="h-6 w-6 text-red-600" />
              ) : null}
              <AlertDialogTitle>{alertDialog.title}</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              {alertDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertDialog({ ...alertDialog, open: false })}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>

  )
}
