import PropTypes from "prop-types";
import { Card } from "../components/ui/card";
import getIconForFileType from "../helperFunctions/getIconForFileType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import getSizeForFile from "../helperFunctions/getSizeForFile";
import getShortFileName from "../helperFunctions/getShortFileName";
import { Button } from "../components/ui/button";
import { X } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";

const ActionCards = ({
  // Renamed from 'File' to 'file' to follow standard camelCase naming
  actions,
  action, // Renamed from 'action' to 'actions' for consistency with the Home component
  setActions,
  setDefaultTabValue, // Renamed from 'setDefaultValues' for clarity
  updateAction,
  setSelectedConversionType, // Renamed from 'setSelected' for clarity
  defaultTabValue, // Renamed from 'defaultValues' for clarity // Renamed from 'typeSelected' for clarity
  setIsTypeSelected, // Renamed from 'setTypeSelected' for clarity
  isConversionComplete,
  downloadFile,
}) => {
  const fileExtensions = {
    image: [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "webp",
      "ico",
      "tif",
      "tiff",
      "svg",
      "raw",
      "tga",
    ],
    video: [
      "mp4",
      "m4v",
      "mp4v",
      "3gp",
      "3g2",
      "avi",
      "mov",
      "wmv",
      "mkv",
      "flv",
      "ogv",
      "webm",
      "h264",
      "264",
      "hevc",
      "265",
    ],
    audio: ["mp3", "wav", "ogg", "aac", "wma", "flac", "m4a"],
  };

  const removeFile = (fileName) => {
    setActions(actions.filter((file) => file.file_name !== fileName));
    setDefaultTabValue(defaultTabValue);
    setIsTypeSelected(false);
    setSelectedConversionType("Convert to...");
  };

  return (
    <div className="flex items-center justify-center md:w-full  flex-col gap-4">
      <Card className="md:flex items-center w-[350px] md:w-[1100px] rounded-[4px] h-[100px] md:h-[80px] justify-between">
        <div className="flex items-center md:pl-10 px-2 py-3 gap-2 md:w-[400px] w-full break-words truncate">
          {getIconForFileType(action)}
          <p className="font-medium ">
            {getShortFileName(action.file_name, 25)}
          </p>
          <p className="font-light">({getSizeForFile(action.file_size)})</p>
        </div>
        {action.isError ? ( // Use 'isError' instead of 'is_error' for consistency
          <Badge className="md:mr-10 mx-5 md:mx-0 rounded-[4px]" variant="destructive">
            Error converting this file
          </Badge>
        ) : action.isConverted ? ( // Use 'isConverted' instead of 'is_converted' for consistency
          <Badge className="md:mr-10 mx-5 md:mx-0 rounded-[4px]" variant="secondary">
            Converted
          </Badge>
        ) : action.isConverting ? ( // Use 'isConverting' instead of 'is_converting' for consistency
          <Badge className="mx-5 md:mx-10 rounded-[4px]" variant="default">
            Converting...
          </Badge>
        ) : (
          <div className="flex items-center gap-5 px-10">
            <Select
              onValueChange={(value) => {
                if (fileExtensions.audio.includes(value)) {
                  setDefaultTabValue("audio");
                } else if (fileExtensions.video.includes(value)) {
                  setDefaultTabValue("video");
                }
                setSelectedConversionType(value);
                updateAction(action.file_name, value);
                setIsTypeSelected(true);
              }}
            >
              <SelectTrigger className="rounded-[4px] min-w-[120px]">
                <SelectValue placeholder="Convert to... &nbsp;" />
              </SelectTrigger>
              <SelectContent className="rounded-[4px]">
                {action.file_type.includes("image") && (
                  <div className="grid grid-cols-2 gap-2 w-fit">
                    {fileExtensions.image.map((ext, i) => (
                      <div key={i} className="col-span-1 text-center">
                        <SelectItem value={ext} className="mx-auto">
                          {ext}
                        </SelectItem>
                      </div>
                    ))}
                  </div>
                )}
                {action.file_type.includes("video") && (
                  <Tabs defaultValue={defaultTabValue} className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="video" className="w-full">
                        Video
                      </TabsTrigger>
                      <TabsTrigger value="audio" className="w-full">
                        Audio
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="video">
                      <div className="grid grid-cols-3 gap-2 w-fit">
                        {fileExtensions.video.map((ext, i) => (
                          <div key={i} className="col-span-1 text-center">
                            <SelectItem value={ext} className="mx-auto">
                              {ext}
                            </SelectItem>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="audio">
                      <div className="grid grid-cols-3 gap-2 w-fit">
                        {fileExtensions.audio.map((ext, i) => (
                          <div key={i} className="col-span-1 text-center">
                            <SelectItem value={ext} className="mx-auto">
                              {ext}
                            </SelectItem>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
                {action.file_type.includes("audio") && (
                  <div className="grid grid-cols-2 gap-2 w-fit">
                    {fileExtensions.audio.map((ext, i) => (
                      <div key={i} className="col-span-1 text-center">
                        <SelectItem value={ext} className="mx-auto">
                          {ext}
                        </SelectItem>
                      </div>
                    ))}
                  </div>
                )}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => removeFile(action.file_name)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        {isConversionComplete && !action.isError ? (
          <Button
            variant="outline"
            onClick={() => downloadFile(action)}
            className="mr-10 rounded-[4px]"
          >
            Download
          </Button>
        ) : null}
      </Card>
    </div>
  );
};

ActionCards.propTypes = {
  action: PropTypes.shape({
    file_name: PropTypes.string,
    file_type: PropTypes.string,
    file_size: PropTypes.number,
    isConverted: PropTypes.bool,
    isConverting: PropTypes.bool,
    isError: PropTypes.bool,
  }),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      type: PropTypes.string,
    })
  ).isRequired,
  setActions: PropTypes.func.isRequired,
  setDefaultTabValue: PropTypes.func.isRequired,
  updateAction: PropTypes.func.isRequired,
  setSelectedConversionType: PropTypes.func.isRequired,
  selectedConversionType: PropTypes.string,
  defaultTabValue: PropTypes.string,
  isTypeSelected: PropTypes.bool,
  setIsTypeSelected: PropTypes.func,
  downloadAllFiles: PropTypes.func,
  resetState: PropTypes.func,
  isConversionComplete: PropTypes.bool,
  downloadFile: PropTypes.func,
  setIsSuccess: PropTypes.func,
  removeFile: PropTypes.func,
};

export default ActionCards;
