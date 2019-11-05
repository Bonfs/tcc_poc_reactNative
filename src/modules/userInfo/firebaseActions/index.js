import { auth, database, REF } from "../../../config/firebaseConstants";

export function saveUserInfo(data, callback) {
	const currentUser = auth().currentUser;
	const userInfosRef = database().ref(`${REF}/${currentUser.uid}/infos`);

	userInfosRef
		.set(
			data,
			(error) => {
				callback(error);
			}
		);
}
