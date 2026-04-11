import { ref, get, set } from "firebase/database";
import { rtdb } from "../Firebaseconfig";

export const InitTutorials = async () => {
  const tutorialRef = ref(rtdb, "tutorials");

  const snapshot = await get(tutorialRef);

  // if already exists → stop
  if (snapshot.exists()) return;

  // otherwise insert data
  await set(tutorialRef, {
    caesar: {
      title: "Caesar Cipher",
      introduction: "Caesar Cipher shifts letters.",
      example: "HELLO → KHOOR",
    },
    columnar: {
      title: "Columnar Cipher",
      introduction: "Rearranges characters.",
      example: "HELLO → ODLREOHWLX",
    },
    railfence: {
      title: "Rail Fence Cipher",
      introduction: "Zig-zag pattern.",
      example: "HELLO → HOELL",
    },
    vigenere: {
      title: "Vigenere Cipher",
      introduction: "Keyword-based encryption.",
      example: "HELLO + KEY → RIJVS",
    },
  });
};