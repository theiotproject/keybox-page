import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "src/backend/db_config";

export default function useKeyboxData(keyboxId) {
    const [isLoading, setLoading] = useState(false);
    const [keyboxData, setKeyboxData] = useState(null);
  
    useEffect(() => {
      if (!keyboxId) return; 
      
      const keyboxCollectionRef = collection(db, "keyboxes");
      const keyboxQuery = query(keyboxCollectionRef, where("keyboxId", "==", keyboxId));
      
      const fetchKeyboxData = async () => {
        setLoading(true);
        const keyboxSnapshot = await getDocs(keyboxQuery);
        const keyboxData = keyboxSnapshot.docs[0];
        setKeyboxData(keyboxData);
        setLoading(false);
      };
  
      fetchKeyboxData();
  
    }, [keyboxId]);
  
    return { keyboxData, isLoading };
}