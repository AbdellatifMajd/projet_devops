import Container from "@mui/material/Container";
import CommonForm from "../components/common/CommonForm";
import { loginFormControls } from "../config";
import Paper from "@mui/material/Paper";
import CommonFormFooter from "../components/common/CommonFormFooter";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/AuthSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [loginFormData, setLoginFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginFormData.email || !loginFormData.password) {
      toast.warning("all fields are required!")
      return;
    }
    try {
      const response = await dispatch(loginUser(loginFormData)).unwrap();
      const role = response?.role;

      if (response) {
        navigate(role === "admin" ? "/admin/chambres" : "/booking/listing");
        toast.success("user logged in successfully");
      }

    } catch (error) {
      toast.error("Invalid email or password");
      console.log("je suis tombé dans le catch:", error);
    }
  };

  return (
    <Container
      maxWidth="lg"
      className="h-screen w-full flex items-center justify-center bg-gray-100"
    >
      <Paper
        elevation={3}
        sx={{ p: 6, borderRadius: 2 }}
        className="flex flex-col w-xl"
      >
        <div className="mb-8">
          <div className="flex items-center mb-4 gap-2">
            <img src="/images/hand.png" alt="hand" className="w-7 h-7" />
            <span className="text-xl font-semibold tracking-widest text-gray-400 uppercase">
              Welcome Back
            </span>
          </div>
        </div>

        <CommonForm
          formControls={loginFormControls}
          formData={loginFormData}
          setFormData={setLoginFormData}
          onSubmit={handleSubmit}
          buttonText={"Sign in"}
        />

        <CommonFormFooter />
      </Paper>
    </Container>
  );
}

export default Login;
