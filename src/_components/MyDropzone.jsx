import { CloudDownload, CloudUpload } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";
import { toast } from "sonner";

export default function MyDropzone({ setActions }) {
  MyDropzone.propTypes = {
    actions: PropTypes.array,
    setActions: PropTypes.func,
  };

  const acceptedFileTypes = useMemo(
    () => ({
      "image/*": [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".bmp",
        ".webp",
        ".ico",
        ".svg",
        ".tif",
        ".tiff",
        ".raw",
        ".tga",
      ],
      "video/*": [],
      "audio/*": [],
    }),
    []
  );

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        toast.error("Some files were rejected due to invalid file types.");
      }

      const filteredFiles = acceptedFiles.filter((file) => {
        const fileType = file.type.split("/")[0];
        return (
          (fileType === "image" &&
            acceptedFileTypes["image/*"].includes(
              `.${file.name.split(".").pop()}`
            )) ||
          fileType === "video" ||
          fileType === "audio"
        );
      });

      if (filteredFiles.length !== acceptedFiles.length) {
        toast.error("Some files were rejected due to invalid file types.");
      }

      const newActions = filteredFiles.map((file) => ({
        file_name: file.name,
        file_size: file.size,
        from: file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2),
        to: null,
        file_type: file.type,
        file,
        is_converted: false,
        is_converting: false,
        is_error: false,
      }));

      setActions([...newActions]);
    },
    [setActions, acceptedFileTypes]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: Object.keys(acceptedFileTypes).join(","),
  });

  return (
    <div className="border-dashed w-[290px] md:h-[300px] h-[200px] md:w-[1000px] border-purple-300 dark:border-gray-500 border-2 rounded-sm text-center">
      <div
        className="flex items-center justify-center h-full w-full "
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="flex flex-col gap-3 items-center justify-center select-none">
            <p>
              <CloudDownload size={55} />
            </p>
            <p className="font-medium text-md md:text-xl">Drop the files here ...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 items-center justify-center select-none">
            <p className="text-xl">
              <CloudUpload size={55} />
            </p>
            <p className="font-medium text-md md:text-xl">
              Drag &apos;n&apos; drop some files here, or click to select files
            </p>
            <p className="text-sm">( Multiple files supported )</p>
          </div>
        )}
      </div>
    </div>
  );
}
