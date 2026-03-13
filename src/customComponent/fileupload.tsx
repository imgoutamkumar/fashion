import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Divide, FileText, Upload, X } from "lucide-react"
import { useState } from "react"


export type FileUploadProps = {
  inputId : string
  multiple?: boolean
  accept?: string
  maxSizeMB?: number
  onChange?: (files: File[]) => void
  selectedFiles: File[]
}

export const FileUpload = ({
  inputId,
   multiple = true,
  accept = "image/*,application/pdf",
  maxSizeMB = 5,
  onChange,
selectedFiles }: FileUploadProps) => {

  // const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files).filter((file) => {
      const isValidSize = file.size / (1024 * 1024) <= maxSizeMB
      if (isValidSize) return true;
    })

    const updatedFiles = [...selectedFiles, ...selected]
    // setFiles(Array.from(e.target.files))
    onChange?.(updatedFiles)

    // important: reset input value
    e.target.value = ""
  }

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index)
    // setFiles(updated)
    onChange?.(updated)
  }

  return (
    <div className="flex flex-col w-full">
      {/* <Label htmlFor="file-upload" className="mb-2">Product Images</Label> */}
      <Card className="mx-auto rounded-2xl shadow-md w-full">
        <CardContent className="p-6 space-y-4">
          <label
            htmlFor={inputId}
            className={cn(
              "flex flex-col items-center justify-center gap-3",
              "border-2 border-dashed rounded-2xl p-6",
              "cursor-pointer transition",
              "hover:border-primary hover:bg-muted"
            )}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-muted-foreground">
              Images or PDF · Max {maxSizeMB}MB each
            </p>
            <input
              id={inputId}
              type="file"
              className="hidden"
              multiple={multiple}
              accept={accept}
              onChange={handleFileChange}
            />
          </label>

          {selectedFiles?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:grid-cols-3">
              {selectedFiles?.map((file, index) => {
                const isImage = file.type.startsWith("image/")
                const preview = isImage ? URL.createObjectURL(file) : null

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border p-3"
                  >
                    <div className="flex items-center gap-3">
                      {isImage ? (
                        <img
                          src={preview!}
                          alt={file?.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <FileText className="h-6 w-6 text-primary" />
                      )}

                      <div className="text-sm">
                        <p className="font-medium truncate max-w-[200px]">
                          {file?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(file?.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      type="button"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>

  )
}

export default FileUpload