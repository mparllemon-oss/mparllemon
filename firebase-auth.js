const config={"apiKey":"AIzaSyCj726MRJf4ttAF0LLfSTurIFjTl7-fjVE","authDomain":"protofolio-fab57.firebaseapp.com","projectId":"protofolio-fab57","storageBucket":"protofolio-fab57.firebasestorage.app","messagingSenderId":"1090790318039","appId":"1:1090790318039:web:a93aab56fedfe36fffb592"};
let loading;
export function loadFirebaseAuth(){
  if(!loading) loading=Promise.all([
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js')
  ]).then(([appSdk,authSdk])=>{
    const app=appSdk.initializeApp(config);
    return {...authSdk,app,auth:authSdk.getAuth(app)};
  });
  return loading;
}
export function authError(error){
  const messages={
    'auth/invalid-credential':'Email or password is incorrect.',
    'auth/wrong-password':'Email or password is incorrect.',
    'auth/user-not-found':'Email or password is incorrect.',
    'auth/email-already-in-use':'An account already exists for this email. Please log in.',
    'auth/weak-password':'Choose a stronger password with at least 6 characters.',
    'auth/password-does-not-meet-requirements':'This password does not meet the account password requirements.',
    'auth/invalid-email':'Please enter a valid email address.',
    'auth/operation-not-allowed':'Email/password login is not enabled in Firebase yet.',
    'auth/configuration-not-found':'Firebase Authentication needs to be set up for this project.',
    'auth/unauthorized-domain':'This website domain needs to be authorized in Firebase.',
    'auth/network-request-failed':'Connection failed. Check your internet and try again.',
    'auth/too-many-requests':'Too many attempts. Please wait a few minutes and try again.',
    'auth/user-disabled':'This account is disabled.'
  };
  return messages[error?.code]||'Unable to connect. Please try again.';
}
