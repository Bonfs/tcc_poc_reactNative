import firebase from "react-native-firebase";

const DB_TYPE = __DEV__ ? 'debug' : 'production'; // debug | production
const REF = `${DB_TYPE}/users`;

export const { auth, database } = firebase;
export {
    DB_TYPE, // debug | production
    REF,
};
