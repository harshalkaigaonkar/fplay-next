import { UseSession } from "types";

interface HeaderProps {
    session: UseSession,
    room_id?: string,
    paused?: boolean //removed when to redux 
   }