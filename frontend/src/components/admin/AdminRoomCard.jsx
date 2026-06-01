import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { toast } from "react-toastify";

function AdminRoomCard({
  room,
  setFormData,
  setOpenDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleEditClick = (e) => {
    e.preventDefault();

    setOpenDialog(true);
    setCurrentEditedId(room?.id);
    setFormData(room);
    toast.success("Room updated successfully")
  };

  const handleDeleteClick = () => {
    if (confirmDelete) {
      handleDelete(room?.id);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <Card
      onMouseLeave={() => setConfirmDelete(false)}
      sx={{
        borderRadius: "16px",
        border: "1px solid #e7e5e4",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
      className="group"
    >
      {/* Image container */}
      <div className="relative overflow-hidden h-[220px]">
        <img
          src={room?.imageUrl}
          alt={room?.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick action buttons — slide up on hover */}
        <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button
            onClick={(e)=>handleEditClick(e)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white/95 text-sm font-medium py-2 rounded-xl hover:bg-white hover:cursor-pointer"
          >
            Edit
          </button>

          <button
            onClick={handleDeleteClick}
            className={`flex-1 flex items-center justify-center gap-1.5 backdrop-blur-sm text-sm font-medium py-2 rounded-xl hover:cursor-pointer
              ${
                confirmDelete
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white/95 text-stone-800 hover:bg-white"
              }`}
          >
            {confirmDelete ? "Confirm?" : "Delete"}
          </button>
        </div>
      </div>

      {/* Content */}
      <CardContent sx={{ pb: 1 }}>
        <h2 className="text-base font-semibold text-stone-900 truncate mb-3">
          {room?.title}
        </h2>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-stone-900">
              ${room?.pricePerNight}
            </span>
            <span className="text-xs text-stone-400 font-normal">/ night</span>
          </div>
        </div>
      </CardContent>

      {/* Thin bottom accent line */}
      <CardActions disableSpacing sx={{ p: 0 }}>
        <div className="w-full h-0.5 bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200" />
      </CardActions>
    </Card>
  );
}

export default AdminRoomCard;