import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import {useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSelector } from "react-redux";


function BookingClientCard({ rooms, handleBookNow}) {

  const [selectedRoom, setSelectedRoom] = useState(null);
  
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const { user } = useSelector((state) => state.auth);
  

  const handleOpenModal = (room) => {
    setSelectedRoom(room);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
    setCheckInDate(null);
    setCheckOutDate(null);
  };


  return (
    // Nous enveloppons tout le composant dans le provider de localisation
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <>
        {rooms.map((room) => (
          <div key={room.id} className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
            <div className="relative overflow-hidden">
              <img 
                src={room?.imageUrl} 
                alt={room.title} 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-stone-800 shadow-sm">
                ${room.pricePerNight} <span className="text-[10px] font-normal">/night</span>
              </div>
            </div>

            <div className="p-5 flex-grow">
              <h3 className="text-xl font-bold text-stone-800 mb-2">{room.title}</h3>
              <div className="flex gap-2 mb-4">
                 <span className="text-[11px] uppercase tracking-wider bg-stone-100 px-2 py-1 rounded-md text-stone-600 font-semibold">
                   {room.category}
                 </span>
                 <span className="text-[11px] uppercase tracking-wider bg-amber-50 px-2 py-1 rounded-md text-amber-700 font-semibold">
                   {room.bedType}
                 </span>
              </div>
            </div>

            <div className="p-5 pt-0 mt-auto">
              <button 
                  className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3 rounded-xl font-bold transition-colors duration-200 cursor-pointer"
                  onClick={() => handleOpenModal(room)}    
              >
                Book Now
              </button>
            </div>
          </div>
        ))}

        <Dialog 
          open={Boolean(selectedRoom)} 
          onClose={handleCloseModal}
          fullWidth
          maxWidth="sm"
          PaperProps={{
              sx: { borderRadius: "24px", padding: "8px" }
          }}
        >
          <DialogTitle className="text-2xl font-bold text-stone-800">
              Booking: {selectedRoom?.title}
          </DialogTitle>
          
          <DialogContent>
              <p className="text-stone-500 mb-6 text-sm">
                  Please provide your details to finalize your reservation request at Riad Sania.
              </p>
              
              <div className="grid grid-cols-1 gap-5 mt-2">
  
                  {/* --- SECTION DES DATES  --- */}
                  <div className="grid grid-cols-2 gap-4">
                    <DatePicker
                      label="Check-in Date "
                      value={checkInDate}
                      onChange={(newValue) => setCheckInDate(newValue)}
                      slotProps={{ 
                        textField: { 
                          variant: 'outlined', 
                          fullWidth: true,
                        } 
                      }}
                    />
                    <DatePicker
                      label="Check-out Date "
                      value={checkOutDate}
                      onChange={(newValue) => setCheckOutDate(newValue)}
                      slotProps={{ 
                        textField: { 
                          variant: 'outlined', 
                          fullWidth: true,
                        } 
                      }}
                    />
                  </div>

                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 mb-2">
                    <div className="flex justify-between items-center text-stone-700">
                      <span className="text-sm font-medium">Rate per night</span>
                      <span className="font-bold">${selectedRoom?.pricePerNight}</span>
                    </div>
                  </div>

                  <button 
                  className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3 rounded-xl font-bold transition-colors duration-200 cursor-pointer"
                      onClick={() => {
                          handleBookNow(selectedRoom?.id, checkInDate, checkOutDate, user);
                          handleCloseModal();
                      }}
                  >
                      Confirm Booking
                  </button>
                  
                  <button 
                      className="w-full text-stone-400 text-sm font-medium hover:text-stone-600 transition-colors cursor-pointer"
                      onClick={handleCloseModal}
                  >
                      Cancel
                  </button>
              </div>
          </DialogContent>
        </Dialog>
      </>
    </LocalizationProvider>
  );
}

export default BookingClientCard;