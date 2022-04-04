import * as admin from 'firebase-admin';
import { Continent } from './models/continent';
import { ContinentReport } from './models/report';
import { SuspendedContinents } from './models/suspended-continents';

type CollectionRefType<DataType> = admin.firestore.CollectionReference<DataType>;

export const db = admin.firestore();

export const continentsCol = db.collection(`continents`) as CollectionRefType<Continent>;
export const suspendedContinentsRef = db.collection(`suspendedContinents`) as CollectionRefType<SuspendedContinents>;
export const reportsRef = db.collection(`reports`) as CollectionRefType<ContinentReport>;
