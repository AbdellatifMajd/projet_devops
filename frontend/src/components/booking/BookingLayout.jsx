import { Outlet } from "react-router";
import BookingHeader from "./BookingHeader";

function BookingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
        <BookingHeader />
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default BookingLayout;