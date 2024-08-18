import { FileImage, FileVideo, File, FileMusic } from "lucide-react";

const getIconForFileType = (file) => {
  console.log("the file revived is", file);
  const fileType = file.file_type.split("/")[0];
  if (fileType === "image") {
    return <FileImage className="h-7 w-7 text-primary" />;
  } else if (fileType === "video") {
    return <FileVideo className="h-7 w-7 text-primary" />;
  } else if (fileType === "audio") {
    return <FileMusic className="h-7 w-7 text-primary" />;
  } else {
    return <File className="h-6 w-6 text-primary" />;
  }
};

export default getIconForFileType;
