import toast from "react-hot-toast";

export const successToast = (message) => {
  toast.success(message, {
    style: {
      border: "1px solid #4EB826",
      padding: "16px",
      color: "#ffffff",
      background: "#4EB826",
    },
    iconTheme: {
      primary: "#4EB826",
      secondary: "#FFFAEE",
    },
  });
};

export const errorToast = (message) => {
  toast.success(message, {
    style: {
      border: "1px solid #DC0913",
      padding: "16px",
      color: "#ffffff",
      background: "#DC0913",
    },
    iconTheme: {
      primary: "#DC0913",
      secondary: "#FFFAEE",
    },
  });
};
