import showError from "src/components/Toasts/ToastError";
import showSuccess from "src/components/Toasts/ToastSuccess";

import { collection, getDoc, getDocs } from "firebase/firestore";

const getFormattedPrivilagesToSlots = async (keyboxRef) => {
  let cardSlots = [];
  const slotsColletionRef = collection(keyboxRef, "slots");
  const slotsCollectionSnapshots = await getDocs(slotsColletionRef);

  // Iterate over slots docs
  for (const slotsCollectionSnapshot of slotsCollectionSnapshots.docs) {
    // Iterate over slot authorized cards
    for (const slotCard of slotsCollectionSnapshot.data().authorizedCards) {
      // Make sure that cardId length is 10 characters
      let hexCardId = slotCard.toString(16).split("");
      while (hexCardId.length != 10) {
        hexCardId.unshift("0");
      }

      let obj = {};
      obj[hexCardId.join("")] = Number(slotsCollectionSnapshot.id);
      cardSlots.push(obj);
    }
  }

  //   Transform object into format
  //    key:val
  //    hexCardId: [arrayOfAuthorizedSlots]
  let temp = {};

  for (var i = 0; i < cardSlots.length; i++) {
    var currentObj = cardSlots[i];
    for (var prop in currentObj) {
      if (temp[prop] === undefined) {
        temp[prop] = [];
      }
      temp[prop].push(currentObj[prop]);
    }
  }

  cardSlots = temp;

  let privToSlots = 0;
  let temp2 = [];
  for (const cardId in cardSlots) {
    if (cardSlots.hasOwnProperty(cardId)) {
      const slotIds = cardSlots[cardId];
      privToSlots = 0;
      slotIds.map((slotId) => {
        privToSlots |= 1 << (slotId - 1);
      });

      // Make sure that cardId length is 2 characters
      let fixedPrivToSlots = privToSlots.toString().split("");
      while (fixedPrivToSlots.length != 2) {
        fixedPrivToSlots.unshift("0");
      }

      temp2.push(`${cardId}:${fixedPrivToSlots.join("")}`);
    }
  }

  return temp2;
};

export const updateSlotsPrivilagesToGoliothState = async (keyboxRef) => {
  const myHeaders = new Headers();
  myHeaders.append("X-API-Key", import.meta.env.VITE_GOLIOTH_API_KEY);

  const privilagesToSlots = await getFormattedPrivilagesToSlots(keyboxRef);

  const myInit = {
    method: "PUT",
    headers: myHeaders,
    body: JSON.stringify(privilagesToSlots),
  };

  const keyboxData = await getDoc(keyboxRef);

  await fetch(
    `https://api.golioth.io/v1/projects/keybox/devices/${
      keyboxData.data().keyboxId
    }/data/acl`,
    myInit
  )
    .catch((error) => {
      showError(
        `Error while sending query to Golioth, check console for more info`
      );
      console.error(error);
    })
    .then(() => {
      showSuccess("Golioth success");
    });
};
