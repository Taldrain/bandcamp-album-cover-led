import dotenv from "dotenv"

dotenv.config();

export const PORT = parseInt(process.env.PORT || "8080", 10);
export const IMAGE_VIEWER_BINARY_PATH = process.env.IMAGE_VIEWER_BINARY_PATH || "";
export const GPIO_MAPPING = process.env.GPIO_MAPPING || "adafruit-hat";
export const PIXEL_MAPPER = process.env.PIXEL_MAPPER || "Rotate:180";
export const BRIGHTNESS = parseInt(process.env.BRIGHTNESS || "50", 10);
