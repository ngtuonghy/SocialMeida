import React from "react";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import env from "~/config/env";

export const cloudinary = new Cloudinary({
	cloud: {
		cloudName: env.uploadImage.cloudnaryName,
	},
});
