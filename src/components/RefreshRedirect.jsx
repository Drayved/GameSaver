import { useEffect } from "react";
import { useNavigate, Router } from "react-router-dom";

const RefreshRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return (
    <Router>
      
      <div>Redirecting...</div>
    </Router>
  );
};

export default RefreshRedirect;