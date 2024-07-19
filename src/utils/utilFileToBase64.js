const ensureBlob = (file, type) => {
	if (file instanceof Blob) {
		return file;
	} else if (file instanceof File) {
		return file;
	} else {
		const blob = new Blob([file], { type: "image/jpeg" });
		return blob;
	}
};
export const getBase64 = async (file, callback) => {
	const blob = ensureBlob(file);
	const reader = new FileReader();
	reader.readAsDataURL(blob);
	reader.onloadend = () => {
		callback(reader.result);
	};
};

export const blobToBase64 = (blob) => {
	const reader = new FileReader();
	reader.readAsDataURL(blob);
	return new Promise((resolve) => {
		reader.onloadend = () => {
			resolve(reader.result);
		};
	});
};
