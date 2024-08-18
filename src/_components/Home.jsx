/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import MyDropzone from "./MyDropzone";
import ActionCards from "./ActionCards";
import { ScrollArea } from "../components/ui/scroll-area";
import { Button } from "../components/ui/button";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import loadFfmpeg from "../helperFunctions/load-ffmpeg";
import Spinner from "./Spinner";
import convertFile from "../helperFunctions/convertFile";
import Footer from "./Footer";

const Home = () => {
  const [actions, setActions] = useState([]); // Renamed from 'action' to 'actions' for clarity
  const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false); // Renamed 'loaded' to 'isFFmpegLoaded' for clarity
  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef(null);

  const [isReadyToConvert, setIsReadyToConvert] = useState(false); // Renamed from 'isReady'
  const [files, setFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false); // Use camelCase for consistency
  const [isConversionComplete, setIsConversionComplete] = useState(false); // Renamed from 'isDone'
  const [defaultTabValue, setDefaultTabValue] = useState("video"); // Renamed 'defaultValues' for clarity
  const [selectedConversionType, setSelectedConversionType] = useState(""); // Renamed 'selected'
  const [isTypeSelected, setIsTypeSelected] = useState(false); // Renamed 'typeSelected'
  const [isSuccess, setIsSuccess] = useState(false);

  const resetState = () => {
    setIsConversionComplete(false);
    setActions([]);
    setFiles([]);
    setIsReadyToConvert(false);
    setIsConverting(false);
    setIsSuccess(false);
    setDefaultTabValue("video");
    setSelectedConversionType("");
    setIsTypeSelected(false);
    messageRef.current.textContent = "";
  };

  const downloadAllFiles = () => {
    actions.forEach((act) => {
      if (!act.isError) downloadFile(act); // Renamed 'is_error' to 'isError'
    });
  };

  const downloadFile = (act) => {
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = act.url;
    link.download = act.output;

    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(act.url);
    document.body.removeChild(link);
  };

  const loadFFmpeg = async () => {
    const ffmpegInstance = await loadFfmpeg();
    ffmpegRef.current = ffmpegInstance;
    setIsFFmpegLoaded(true);
  };

  const convertFiles = async () => {
    console.log(isConverting);

    let updatedActions = actions.map((action) => ({
      ...action,
      isConverting: true,
    }));
    setActions(updatedActions);
    setIsConverting(true);

    for (let action of updatedActions) {
      try {
        const { url, output } = await convertFile(ffmpegRef.current, action);
        updatedActions = updatedActions.map((act) =>
          act.file_name === action.file_name
            ? { ...act, isConverted: true, isConverting: false, url, output }
            : act
        );
        setActions(updatedActions);
        setIsSuccess(true);
      } catch (err) {
        updatedActions = updatedActions.map((act) =>
          act.file_name === action.file_name
            ? { ...act, isConverted: false, isConverting: false, isError: true }
            : act
        );
        setActions(updatedActions);
        setIsSuccess(false);
        console.log(err);
      }
    }

    setIsConversionComplete(true);
    setIsConverting(false);
  };

  const updateAction = (fileName, conversionType) => {
    setActions(
      actions.map((action) =>
        action.file_name === fileName
          ? { ...action, to: conversionType }
          : action
      )
    );
  };

  const checkIsReadyToConvert = () => {
    const allActionsReady = actions.every((act) => !!act.to);
    setIsReadyToConvert(allActionsReady);
  };

  useEffect(() => {
    if (!actions.length) {
      resetState();
    } else {
      checkIsReadyToConvert();
    }
  }, [actions]);

  useEffect(() => {
    loadFFmpeg();
  }, []);

  return (
    <ScrollArea className="w-full h-screen">
      <div className="md:space-y-10 md:py-[150px] py-[100px] pb-8">
        <div className="space-y-6">
          <h1 className="text-3xl md:text-6xl font-medium text-center">
            Online File Converter
          </h1>
          <p className="text-grey-400 font-medium text-md md:text-xl px-5 text-center md:px-24 xl:px-44 2xl:px-52">
            Unleash your creativity with ConvertMate – the ultimate online tool
            for unlimited and free multimedia conversion. Transform images,
            audio, and videos effortlessly, without restrictions. Start
            converting now and elevate your content like never before!
          </p>
          <p ref={messageRef}></p>
          <div className="flex items-center justify-center w-full px-5">
            {actions.length === 0 && (
              <MyDropzone actions={actions} setActions={setActions} />
            )}
          </div>
        </div>

        {actions.length > 0 && (
          <div className="flex flex-col items-center justify-center pb-[50px] w-[400px] md:w-full gap-7">
            {actions.map((action) => (
              <div
                key={action.file_name}
                className="flex items-center justify-center w-full"
              >
                <ActionCards
                  action={action}
                  actions={actions}
                  setActions={setActions}
                  setDefaultTabValue={setDefaultTabValue}
                  updateAction={updateAction}
                  setSelectedConversionType={setSelectedConversionType}
                  defaultTabValue={defaultTabValue}
                  setIsTypeSelected={setIsTypeSelected}
                  downloadAllFiles={downloadAllFiles}
                  isConversionComplete={isConversionComplete}
                  downloadFile={downloadFile}
                />
              </div>
            ))}

            <div className="flex items-end justify-center gap-4 w-full px-[220px] md:flex-col">
              {
                isSuccess && actions.length > 1 ? (
                  <Button variant="outline" className="rounded-[4px]" onClick={downloadAllFiles}>
                    Download All
                  </Button>
                ) : null // Placeholder for other action; can be adjusted based on use case
              }
              {isTypeSelected && !isConversionComplete ? (
                <Button
                  className="rounded-[4px] md:w-[180px]"
                  onClick={convertFiles}
                  disabled={isConverting} // Disable the button when converting
                >
                  {isConverting ? (
                    <Spinner /> // Show spinner when converting
                  ) : actions.length === 1 ? (
                    "Convert Now"
                  ) : (
                    "Convert All"
                  )}
                </Button>
              ) : !isConversionComplete ? (
                <Button
                  className="rounded-[4px] md:w-[180px]"
                  disabled // Disable the button when converting
                >
                  Select Type
                </Button>
              ) : null}
              <Button
                variant="outline"
                className="rounded-[4px] md:w-[180px]"
                onClick={resetState}
              >
                Convert other file(s)
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </ScrollArea>
  );
};

export default Home;
