import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Button, Menu, MenuItem, Radio, ListItemText } from "@mui/material";
import { ArrowUpDownIcon } from "lucide-react";
import RoomFilter from "../../components/booking/RoomFilter";
import { sortOptions } from "../../config";
import BookingClientCard from "../../components/booking/BookingClientCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilteredRooms } from "../../store/ClientRoomSlice";
import { createNewBooking, fetchUserBookings } from "../../store/BookingSlice";

function BookingListing() {
  const [buttonMenu, setButtonMenu] = useState(null);
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const { clientRoomList } = useSelector((state) => state.clientRooms);

  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const open = Boolean(buttonMenu);

  const handleOpenMenu = (event) => {
    setButtonMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setButtonMenu(null);
  };

  const handleSort = (value) => {
    setSort(value);
    handleCloseMenu();
  };

  const handleFilters = (getSectionId, getCurrentOption) => {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1) {
        cpyFilters[getSectionId].push(getCurrentOption);
      } else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  };

  const handleBookNow = (getRoomId, getCheckInDate, getCheckOutDate, user) => {
    // Formater les dates en "yyyy-MM-dd"
    const formattedCheckIn = getCheckInDate instanceof Date 
      ? getCheckInDate.toISOString().split('T')[0] 
      : getCheckInDate;

    const formattedCheckOut = getCheckOutDate instanceof Date 
      ? getCheckOutDate.toISOString().split('T')[0] 
      : getCheckOutDate;

    dispatch(
      createNewBooking({
        userId: user?.id,
        roomId: getRoomId,
        checkInDate: formattedCheckIn, 
        checkOutDate: formattedCheckOut, 
      })
    ).then((data) => {
      if(data?.payload?.success){
       dispatch(fetchUserBookings(user?.id));
      }
    });
  };

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(fetchFilteredRooms({ filterParams: filters, sortParams: sort }));
  }, [dispatch, filters, sort]);

  useEffect(() => {
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  const createSearchQueryParamsHelper = (filterParams) => {
    const queryParams = [];
    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",");
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }
    console.log(queryParams, "createSearchQueryParamsHelper");

    return queryParams.join("&");
  };

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createSearchQuery = createSearchQueryParamsHelper(filters);
      setSearchParams(new URLSearchParams(createSearchQuery));
    }
  }, [filters]);



  return (
    <div className="min-h-screen bg-stone-50">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 p-4 md:p-8 max-w-[1600px] mx-auto">
        {/* Sidebar de filtrage */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 h-fit sticky top-6">
          <RoomFilter filters={filters} handleFilters={handleFilters} />
        </div>

        <div className="flex flex-col gap-6">
          {/* Header de la liste */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-stone-800">Our Rooms</h2>
              <p className="text-sm text-stone-500 font-medium">
                {clientRoomList.length} available rooms
              </p>
            </div>

            <Button
              variant="outlined"
              onClick={handleOpenMenu}
              startIcon={<ArrowUpDownIcon className="h-4 w-4" />}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                borderColor: "#e7e5e4",
                color: "#444",
              }}
            >
              Sort by
            </Button>

            <Menu
              anchorEl={buttonMenu}
              open={open}
              onClose={handleCloseMenu}
              slotProps={{ paper: { sx: { borderRadius: "12px", mt: 1 } } }}
            >
              {sortOptions.map((sortItem) => (
                <MenuItem
                  key={sortItem.id}
                  onClick={() => handleSort(sortItem.id)}
                >
                  <Radio checked={sort === sortItem.id} size="small" />
                  <ListItemText primary={sortItem.label} />
                </MenuItem>
              ))}
            </Menu>
          </div>

          {/* Grille de cartes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <BookingClientCard
              rooms={clientRoomList}
              handleBookNow={handleBookNow}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingListing;