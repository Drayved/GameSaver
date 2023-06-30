import { useEffect } from "react";
import { useNavigate, Router, useLocation, Navigate } from "react-router-dom";

const RefreshRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const handleUnload = () => {
      sessionStorage.setItem("refreshed", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  useEffect(() => {
    const refreshed = sessionStorage.getItem("refreshed");
    if (refreshed === "true" && location.pathname !== "/") {
      window.location.href = "/";
    }
  }, [location]);

  return null;
}

export default RefreshRedirect;