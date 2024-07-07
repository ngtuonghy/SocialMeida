import { toast } from "react-toastify";

const toastify = () => {
  const showToast = (message, options = {}) => {
    const { type, position, backgroundColor, color, autoClose } = options;

    const toastOptions = {
      position: position || "bottom-left",
      style: {
        backgroundColor: backgroundColor || "white",
        color: color || "black",
      },
      autoClose: autoClose || 8000,
    };

    switch (type) {
      case "success":
        toast.success(message, toastOptions);
        break;
      case "warning":
        toast.warning(message, toastOptions);
        break;
      case "error":
        toast.error(message, toastOptions);
        break;
      case "info":
        toast.info(message, toastOptions);
        break;
      default:
        toast(message, toastOptions);
        break;
    }
  };

  return showToast;
};

export default toastify;
