/**
 * @flow
 */
import { auth, database, REF } from '../../../config/firebaseConstants';

type ErrorFunction = (error: ?Error) => void;

export function startActvity(
	startActivityData: any,
	callback: ErrorFunction = (error) => console.log(error ? error.message : 'startActvity')
) {
	const uid = auth().currentUser.uid;
	const activityREF = database().ref(`${REF}/${uid}/activities`);

	return activityREF
		.push(
				startActivityData,
				(error) => {
					callback(error);
				}
			);
}

export function updateActivity(
	activityID: string,
	activityData: any,
	callback: ErrorFunction = (error) => console.log(error ? error.message : 'updateActivity')
) {
	const uid = auth().currentUser.uid;
	const activityREF = database().ref(`${REF}/${uid}/activities/${activityID}`);

	activityREF
		.update(
			activityData,
			(error) => {
				callback(error);
			}
		);
}
