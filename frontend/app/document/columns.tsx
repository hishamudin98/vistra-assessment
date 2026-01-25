"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ArrowUpWideNarrow,
  ArrowDownWideNarrow,
  Trash2,
  Edit,
  Download,
  Folder,
  FileText,
  Ellipsis
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FileDocument = {
  id: string;
  name: string;
  type: string;
  size: number;
  createdBy: string;
  createdAt: Date;
  isFolder?: boolean;
};

export const columns: ColumnDef<FileDocument>[] = [
  {
    id: "select",
    header: ({ table }) =>
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />,
    cell: ({ row }) =>
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "name",
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.original
      const b = rowB.original
      
      // Folders always come first
      if (a.isFolder && !b.isFolder) return -1
      if (!a.isFolder && b.isFolder) return 1
      
      // If both are folders or both are files, sort by name
      const aValue = String(rowA.getValue(columnId))
      const bValue = String(rowB.getValue(columnId))
      
      return aValue.localeCompare(bValue)
    },
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-primary hover:text-primary-foreground hover:cursor-pointer hover:border-primary"
        >
          Name
          {isSorted === "asc" ? (
            <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
          ) : isSorted === "desc" ? (
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const isFolder = row.original.isFolder;
      return (
        <div className="flex items-center gap-2 font-medium">
          {isFolder
            ? <Folder className="h-4 w-4 text-yellow-500" />
            : <FileText className="h-4 w-4 text-blue-500" />}
          {name}
        </div>
      );
    }
  },
  {
    accessorKey: "createdBy",
    header: "Created By"
  },
  {
    accessorKey: "createdAt",
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.original
      const b = rowB.original
      
      // Folders always come first
      if (a.isFolder && !b.isFolder) return -1
      if (!a.isFolder && b.isFolder) return 1
      
      // If both are folders or both are files, sort by date
      const aValue = rowA.getValue(columnId) as Date
      const bValue = rowB.getValue(columnId) as Date
      
      return aValue.getTime() - bValue.getTime()
    },
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-primary hover:text-primary-foreground hover:cursor-pointer hover:border-primary"
        >
          Date
          {isSorted === "asc" ? (
            <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
          ) : isSorted === "desc" ? (
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      const formatted = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
      return (
        <div>
          {formatted}
        </div>
      );
    }
  },
  {
    accessorKey: "size",
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.original
      const b = rowB.original
      
      // Folders always come first
      if (a.isFolder && !b.isFolder) return -1
      if (!a.isFolder && b.isFolder) return 1
      
      // If both are folders or both are files, sort by size
      const aValue = rowA.getValue(columnId) as number
      const bValue = rowB.getValue(columnId) as number
      
      return aValue - bValue
    },
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-primary hover:text-primary-foreground hover:cursor-pointer hover:border-primary" 
        >
          File Size
          {isSorted === "asc" ? (
            <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
          ) : isSorted === "desc" ? (
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const size = row.getValue("size") as number;
      const formatted = formatFileSize(size);
      const isFolder = row.original.isFolder;
      return (
        <div>
          {isFolder ? "-" : formatted}
        </div>
      );
    }
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const file = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleDownload(file.id)}>
              <Download className="h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(file.id)}>
              <Edit className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              variant="destructive"
              onClick={() => handleDelete(file.id)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

function handleDownload(id: string) {
  console.log("Download file:", id);
}

function handleEdit(id: string) {
  console.log("Edit file:", id);
}

function handleDelete(id: string) {
  console.log("Delete file:", id);
}
