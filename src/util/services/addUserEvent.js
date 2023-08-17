import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const addUserEvent = async (
  keyboxRef,
  action,
  keyboxId,
  slotId,
  cardId
) => {
  const userEventsCollectionRef = collection(keyboxRef, "userEvents");

  const addUserEventData = {
    timestamp: serverTimestamp(),
    action: action,
    keyboxId: keyboxId,
    slotId: slotId,
    cardId: cardId,
  };

  await addDoc(userEventsCollectionRef, addUserEventData);
};
