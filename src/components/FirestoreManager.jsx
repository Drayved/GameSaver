import { useEffect, useContext } from "react";
import { AuthContext } from "../App";
import { doc, collection } from "firebase/firestore";
import { db } from "../../firebase";

export default function FirestoreManager() {
  const { signedIn, user } = useContext(AuthContext);

  useEffect(() => {
    const createUserSubcollections = async () => {
      if (signedIn && user) {
        // User is signed in
        const userDocRef = doc(db, "users", user.uid);
        const gamesCollectionRef = collection(userDocRef, "games");

        try {
          // Create document in the "games" collection
          await setDoc(userDocRef, { placeholder: true });

          console.log("Games document created successfully");

          // Create subcollections "wantToPlay" and "playedGames" under the created document
          const wantToPlayCollectionRef = collection(userDocRef, "games", "wantToPlay");
          console.log("wantToPlayCollectionRef:", wantToPlayCollectionRef.path);
          const playedGamesCollectionRef = collection(userDocRef, "games", "playedGames");
          console.log("playedGamesCollectionRef:", playedGamesCollectionRef.path);

          await setDoc(wantToPlayCollectionRef, { placeholder: true });
          await setDoc(playedGamesCollectionRef, { placeholder: true });

          console.log("Subcollections created successfully");
        } catch (error) {
          console.log("Error creating subcollections:", error);
        }
      } else {
        // User is not signed in
        console.log("User not signed in");
      }
    };

    createUserSubcollections();
  }, [signedIn, user]);

  return null;
}
