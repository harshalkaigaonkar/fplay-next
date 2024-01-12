import { MongooseRoomTypes, UseSession } from "types";

interface HeaderProps {
    session: UseSession | null,
    room?: MongooseRoomTypes
   }