import { Container, Paper } from "@mui/material";
import CommonForm from "../components/common/CommonForm";
import CommonFormFooter from "../components/common/CommonFormFooter";
import { useState } from "react";
import { registerFormControls } from "../config";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { registerUser } from "../store/authSlice";

function Register() {
const initialFormData = {
  name: "",
  email: "",
  password: "",
  phoneNumber: "", 
  role: ""
};
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(registerUser(formData)).unwrap();
      if(result) navigate("/booking/listing"); 

    } catch (error) {
      
      console.error("An error occurred during registration:", error);
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
          <div className="flex items-center mb-2 gap-2">
            <img src="/images/hand.png" alt="hand" className="w-7 h-7" />
            <span className="text-xl font-semibold tracking-widest text-gray-400 uppercase">
              Welcome to our Riad
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Let's create your account to start your journey.
          </p>
        </div>

        <CommonForm
          formControls={registerFormControls}
          formData={formData}
          buttonText={"Sign Up"}
          setFormData={setFormData}
          onSubmit={handleSubmit}
        />
        <CommonFormFooter />
      </Paper>
    </Container>
  );
}

export default Register;
