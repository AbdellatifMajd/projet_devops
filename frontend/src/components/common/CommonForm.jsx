import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem"; 
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
}) {
  const [showPassword, setShowPassword] = useState(false);

  // Fonction générique pour gérer les changements d'état
  const handleChange = (event, name) => {
    setFormData({
      ...formData,
      [name]: event.target.value,
    });
  };

  const renderInputsByComponentType = () =>
    formControls.map((item) => {
      switch (item.componentType) {
        case "input":
          return (
            <div className="w-full relative mb-7" key={item.name}>
              <TextField
                variant="outlined"
                className="w-full"
                label={item.label}
                type={
                  item.name === "password" && showPassword ? "text" : item.type
                }
                placeholder={item.placeholder}
                value={formData[item.name] || ""} 
                onChange={(event) => handleChange(event, item.name)}
              />

              {item.name === "password" && (
                <span
                  className="absolute right-3 top-5 cursor-pointer text-gray-400"
                  onClick={() =>
                     setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              )}
            </div>
          );

        case "textarea":
          return (
            <div className="w-full relative mb-7" key={item.name}>
              <TextField
                variant="outlined"
                className="w-full"
                multiline          
                minRows={3}        
                label={item.label}
                placeholder={item.placeholder}
                value={formData[item.name] || ""}
                onChange={(event) => handleChange(event, item.name)}
              />
            </div>
          );

        case "select":
          return (
            <div className="w-full relative mb-7" key={item.name}>
              <TextField
                select          
                variant="outlined"
                className="w-full"
                label={item.label}
                value={formData[item.name] || ""}
                onChange={(event) => handleChange(event, item.name)}
              >
                {item.options && item.options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          );

        default:
          return (
            <div className="relative mb-7" key={item.name}>
              <TextField
                variant="outlined"
                className="w-full"
                label={item.label}
                type={item.type}
                placeholder={item.placeholder}
                value={formData[item.name] || ""}
                onChange={(event) => handleChange(event, item.name)}
              />
            </div>
          );
      }
    });

  return (
    <form onSubmit={onSubmit}>
      {renderInputsByComponentType()}
      <div>
        <Button variant="contained" type="submit" className="w-full !p-4">
          {buttonText}
        </Button>
      </div>
    </form>
  );
}

export default CommonForm;