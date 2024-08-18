function getShortFileName(fileName, maxLength) {
  const extension = fileName.substring(fileName.lastIndexOf("."));
  const baseName = fileName.substring(0, fileName.lastIndexOf("."));

  if (baseName.length <= maxLength) {
    return fileName;
  }

  const shortenedBaseName = baseName.substring(0, maxLength - 3) + "";
  return shortenedBaseName + extension;
}

export default getShortFileName;
