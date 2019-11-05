/**
 * @flow
 */
import { /* DataSnapshot, */ Reference, /* UserCredential */ } from "react-native-firebase";
import { auth, database, REF } from '../../../config/firebaseConstants';

type ErrorFunction = (error: ?Error) => void;

export function getActivitiesRef(): Reference {
  const uid = auth().currentUser.uid;
  const activityRef = database().ref(`${REF}/${uid}/activities`);

  return activityRef;
}

export function getUserInfo(): Reference {
  const uid = auth().currentUser.uid;
  const userRef = database().ref(`${REF}/${uid}`);

  return userRef;
}
