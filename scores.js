import {loadFirebaseAuth} from './firebase-auth.js';
let pending;
export function scoreError(error){
  if(error?.code==='permission-denied')return 'Scores are unavailable. The owner needs to finish Firebase score permissions.';
  if(error?.code==='unavailable')return 'Cannot reach the score database. Check your connection and retry.';
  return 'Could not connect to scores. Please retry.';
}
export function loadScores(){
  if(!pending)pending=Promise.all([loadFirebaseAuth(),import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js')]).then(async ([auth,sdk])=>{
    await auth.auth.authStateReady();
    return {...auth,...sdk,db:sdk.getFirestore(auth.app)};
  });
  return pending;
}
export async function saveScore(id,score){
  if(!Number.isSafeInteger(score)||score<0||score>397)throw Error('Invalid score');
  const s=await loadScores(),user=s.auth.currentUser;
  if(!user)throw Error('Please log in');
  if(!user.displayName?.trim())throw Error('Please set your player name');
  await user.getIdToken(true);
  const ref=s.doc(s.db,'gameScores',id);
  // Reuse a session ID when retrying so a timed-out response cannot create duplicates.
  await s.runTransaction(s.db,async tx=>{
    const existing=await tx.get(ref);
    if(existing.exists())return;
    tx.set(ref,{uid:user.uid,playerName:user.displayName.trim().slice(0,80),game:'snake',score,playedAt:s.serverTimestamp()});
  });
}
