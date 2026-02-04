import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./features/auth/authSlice";
import App from "./App";

const AppWrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return <App />;
};

export default AppWrapper;
