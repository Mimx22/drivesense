import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Add a new trip to the Firestore "trips" collection
export const addTrip = async (tripData) => {
  try {
    const docRef = await addDoc(collection(db, "trips"), tripData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding trip: ", error);
    return { success: false, error: error.message };
  }
};

// Delete all trips from Firestore
export const clearAllTrips = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "trips"));
    const deletePromises = querySnapshot.docs.map(document => 
      deleteDoc(doc(db, "trips", document.id))
    );
    await Promise.all(deletePromises);
    return { success: true };
  } catch (error) {
    console.error("Error clearing trips: ", error);
    return { success: false, error: error.message };
  }
};
