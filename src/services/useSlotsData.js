import { db } from "src/backend/db_config";
import useKeyboxData from "./useKeyboxData";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function useSlotsData(slots) {
    const [slotsData, setSlotsData] = useState();
    const [isLoading, setLoading] = useState(false);
    
    useEffect(() => {
        const slotsRef = collection(db, "slots");
        const slotsQuery = query(slotsRef, where("slotId", "in", slots));
        
        const fetchSlotsData = async () => {
            setLoading(true);
            const slotsSnapshot = await getDocs(slotsQuery);
            const slotsData = slotsSnapshot.docs;
    
            setSlotsData(slotsData);
            setLoading(false);
        }
    
        fetchSlotsData();
    }, [])
    
    return { slotsData, isLoading };
}