function getSizeForFile(sizeInBytesString) {
    const sizeInBytes = parseInt(sizeInBytesString, 10);

    if (isNaN(sizeInBytes)) {
        return 'Invalid size';
    }

    if (sizeInBytes < 1024) {
        return sizeInBytes + ' bytes';
    } else if (sizeInBytes < 1024 * 1024) {
        return (sizeInBytes / 1024).toFixed(2) + ' KB';
    } else {
        return (sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
}

export default getSizeForFile;
