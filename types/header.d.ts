import { MongooseRoomTypes, UseSession } from "types";

interface HeaderProps {
    session: UseSession,
    room?: MongooseRoomTypes,
   }