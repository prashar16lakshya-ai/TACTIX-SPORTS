import { db } from '../firebase'
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore'

/**
 * Generates a random code in the format: PREFIX-SPORT-1234
 * @param {string} prefix - Usually 'SPT' for Sport Code or 'TEAM' for Team Code
 * @param {string} sport - The name of the sport (e.g., 'FOOTBALL')
 * @returns {string} The generated code
 */
export function generateCode(prefix, sport) {
  const rand = Math.floor(1000 + Math.random() * 9000)
  const cleanSport = sport.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  return `${prefix.toUpperCase()}-${cleanSport}-${rand}`
}

/**
 * Creates and stores a new access code in Firestore
 */
export async function createAccessCode(codeData) {
  const { code, type, createdBy, schoolId, teamId, schoolName, teamName } = codeData;
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 24); // 24 hour expiry

  const codeDocRef = doc(collection(db, 'access_codes'), code);
  await setDoc(codeDocRef, {
    code,
    type,
    createdBy,
    schoolId: schoolId || '',
    schoolName: schoolName || '',
    teamId: teamId || '',
    teamName: teamName || '',
    createdAt: serverTimestamp(),
    expiry: expiryDate.toISOString(),
    active: true,
    uses: 0
  });

  return code;
}

/**
 * Validates an access code against Firestore
 * @param {string} code - The code to validate
 * @param {string} expectedType - 'sport' or 'team'
 * @returns {Promise<Object>} The validation result { success, data, error }
 */
export async function validateCode(code, expectedType) {
  try {
    const q = query(collection(db, 'access_codes'), where('code', '==', code));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: 'Invalid code. Please check and try again.' };
    }

    const codeDoc = querySnapshot.docs[0].data();

    if (codeDoc.type !== expectedType) {
      return { success: false, error: `Invalid code type. Expected a ${expectedType} code.` };
    }

    if (!codeDoc.active) {
      return { success: false, error: 'This code is no longer active.' };
    }

    const expiryTime = new Date(codeDoc.expiry).getTime();
    if (Date.now() > expiryTime) {
      return { success: false, error: 'This code has expired.' };
    }

    return { success: true, data: codeDoc };
  } catch (error) {
    console.error("Error validating code:", error);
    return { success: false, error: 'Failed to validate code. Please try again.' };
  }
}
