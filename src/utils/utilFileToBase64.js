const ensureBlob = (file) => {
  if (file instanceof Blob) {
    return file;
  } else if (file instanceof File) {
    return file;
  } else {
    const blob = new Blob([file], { type: "image/jpeg" });
    return blob;
  }
};
export const previewFile = async (file, callback) => {
  const blob = ensureBlob(file);
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = () => {
    callback(reader.result);
  };
};
