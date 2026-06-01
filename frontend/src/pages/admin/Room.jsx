import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CommonForm from "../../components/common/CommonForm";
import { addRoomFormElements } from "../../config";
import RoomImageUpload from "../../components/admin/RoomImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { addRoom, deleteRoom, fetchAllRooms } from "../../store/AdminRoomSlice";
import AdminRoomCard from "../../components/admin/AdminRoomCard";
import { toast } from "react-toastify";

function Room() {
  const [openDialog, setOpenDialog] = useState(false);
  const initialFormData = {
    imageUrl: "", // Pour l'URL de l'image ou le fichier
    title: "", // Titre de la chambre (ex: Deluxe Ocean View)
    description: "", // Description
    category: "", // Catégorie (Single, Double, Suite...)
    bedType: "", // Type de lit (Single Bed, King Bed...)
    pricePerNight: "", // Prix par nuit
    capacity: "", // Capacité maximum (nombre de personnes)
  };
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState("");
  const [uploadedImageURL, setUploadedImageURL] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch();
  const roomList = useSelector((state) => state.adminRooms.roomList);

    useEffect(() => {
    dispatch(fetchAllRooms());
  }, [dispatch]);


  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(
      addRoom({
        ...formData,
        imageUrl: uploadedImageURL,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllRooms());
        setImageFile(null);
        setUploadedImageURL("");
        setFormData(initialFormData);
        setCurrentEditedId(null);
        setOpenDialog(false);
        toast.success("Room added successfully!")
      }
    });
  };

  const handleDelete = (getCurrentProductId) => {
    dispatch(deleteRoom(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllRooms());
        toast.success("Room deleted successufully!")
      }
    });
  }


  return (
    <>
      <div className="w-full mb-5 flex justify-end ml-2">
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Add new Room
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {roomList && roomList.length > 0
          ? roomList.map((roomItem) => (
              <AdminRoomCard
                setFormData={setFormData}
                setOpenDialog={setOpenDialog}
                setCurrentEditedId={setCurrentEditedId}
                room={roomItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>

      <Dialog
        fullScreen={fullScreen}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="responsive-dialog-title"
        fullWidth
      >
        <DialogTitle
          id="responsive-dialog-title"
          sx={{ margin: "auto", fontWeight: "bold" }}
        >
          NEW ROOM
        </DialogTitle>

        <RoomImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageURL={uploadedImageURL}
          setUploadedImageURL={setUploadedImageURL}
          imageLoading={imageLoading}
          setImageLoading={setImageLoading}
        />

        <DialogContent>
          <div className="py-6">
            <CommonForm
              formControls={addRoomFormElements}
              formData={formData}
              onSubmit={onSubmit}
              setFormData={setFormData}
              buttonText={"save room"}
            />
          </div>
        </DialogContent>
      </Dialog>

    </>
  );
}

export default Room;
