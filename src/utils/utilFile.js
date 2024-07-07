export const convertFileToDataURL = (file) => {
  if (file.type.includes("video")) {
    return Promise.resolve(URL.createObjectURL(file));
  }
  if (!(file instanceof Blob)) {
    return Promise.reject(
      new Error("Invalid file type. Expected a Blob or File object."),
    );
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

export async function imageUrlToFile(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image (status ${response.status})`);
    }
    const blob = await response.blob();
    const filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
    const file = new File([blob], filename, { type: blob.type });
    return file;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
