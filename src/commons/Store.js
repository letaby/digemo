import React, {useContext} from 'react';
import {Alert} from 'react-native';
import {makeAutoObservable, runInAction} from 'mobx';
import {ethers} from 'ethers';
import auth from '@react-native-firebase/auth';
import {
  dbUsers,
  tmzn,
  colors,
  localStor,
  getLocal,
  timezoneName,
  isIOS,
  setLocal,
} from './utils';
// import {appleAuth} from '@invertase/react-native-apple-authentication';
// import {
//   GoogleSignin,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';

const Context = React.createContext();

const useStore = () => useContext(Context);
export default useStore;

export const StoresProvider = ({children}) => {
  const value = new AuthStore();
  return <Context.Provider {...{value}}>{children}</Context.Provider>;
};

class AuthStore {
  initializing = false;
  profile = {};
  packg = null;
  wallet = getLocal();
  balance = null;
  phrase = null;
  history = null;

  // Qvrn = Qonversion.getSharedInstance();

  constructor() {
    makeAutoObservable(this); //, {}, {autoBind: true});
  }

  get myid() {
    return localStor.getString('myid');
  }

  get isPrem() {
    return this.profile.isPrem || false;
  }

  get dbref() {
    return dbUsers.doc(this.myid);
  }

  setWallet = w => ((this.wallet = w), setLocal(w));

  setBalance = b => (this.balance = b);

  setHistory = h => (this.history = h);

  createWallet = () => {
    let newWalt = ethers.Wallet.createRandom();
    console.log(newWalt);
    let dssd = {
      address: '0x2A5FABF3f180cAb0f37715a21929B6ea2a759460',
      mnemonic: {
        phrase:
          'soul agent enjoy summer little parent kingdom supply alter remain fan venture',
      },
    };
    this.setWallet(newWalt.address);
    runInAction(() => (this.phrase = newWalt?.mnemonic?.phrase));
  };

  setProfile = doc => (this.profile = doc);

  addDBUser = async ob => {
    if (!ob.uid || !ob.email) return;
    let user = {
      ...ob,
      created: Date.now(),
      timezone: tmzn(),
      timezoneName,
      color: colors[Math.round(Math.random() * 27)],
    };
    runInAction(() => (this.setProfile(user), (this.initializing = false)));
    return dbUsers.doc(ob.uid).set(user);
  };

  getDBUser = async ob => {
    if (!ob.uid) return;
    let doc;
    await dbUsers
      .doc(ob.uid)
      .get()
      .catch(er => console.log('ERROR getDBUser', er))
      .then(async d => {
        if (d?.exists) doc = d.data();
        else
          await dbUsers
            .where('email', '==', ob.email)
            .where('provider', '==', ob.provider)
            .limit(1)
            .get()
            .then(q => !q.empty && (doc = q.docs[0].data()));
        if (!doc) return this.addDBUser(ob);
        runInAction(() => (this.setProfile(doc), (this.initializing = false)));
      });

    return doc;
  };

  checkDBUser = async () => this.getDBUser(this.profile);

  googleLogin = async () => {
    this.initializing = true;
    try {
      let {idToken} = await GoogleSignin.signIn();
      if (idToken)
        await auth().signInWithCredential(
          auth.GoogleAuthProvider.credential(idToken),
        ); // then will be handled by onAuthStateChanged listener in APP.js
    } catch (err) {
      runInAction(() => (this.initializing = false));
      if (err.code != statusCodes.SIGN_IN_CANCELLED)
        return alert(
          err.code == statusCodes.PLAY_SERVICES_NOT_AVAILABLE
            ? 'Google Play Services are outdated or missing. This is a necessary app from Android. To update, launch the Google app on this phone and search there "Google Play Services" or "Google Play Services"'
            : 'Error with Google. Make sure you have an internet access, then restart the app and try again\n\n' +
                (err.message || err.toString()),
        );
    }
  };

  appleLogin = async () => {
    this.initializing = true;
    try {
      let appleResp = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        }),
        {identityToken: token, nonce, fullName} = appleResp;
      if (!token)
        return (
          runInAction(() => (this.initializing = false)),
          alert(
            'Error with Apple: no token received. Make sure you have an internet access, then restart the app and try again',
          )
        );
      let {user, additionalUserInfo: add} = await auth().signInWithCredential(
        auth.AppleAuthProvider.credential(token, nonce),
      );
      if (!add.isNewUser) return; // will be handled by onAuthStateChanged listener in APP.js
      let {uid, email} = user,
        {givenName: n1, familyName: n2} = fullName || {},
        name = n1 ? (n1 + ' ' + n2).trim() : 'no name',
        obj = {uid, email, name, provider: 'apple'};
      return this.addDBUser(obj);
    } catch (err) {
      runInAction(() => (this.initializing = false));
      err.code != appleAuth.Error.CANCELED &&
        alert(
          'Error with Apple. Make sure you have an internet access, then restart the app and try again\n\n' +
            (err.message || err.toString()),
        );
    }
  };

  login = isIOS ? this.appleLogin : this.googleLogin;

  logout = async () => (localStor.delete('wallet'), (this.wallet = null));
  // await auth()
  //   .signOut()
  //   .then(
  //     this.setProfile({}),
  //     this.dbref.update({token: null}),
  //     localStor.delete('myid'),
  //   );

  delAccount = async () =>
    await auth()
      .currentUser.delete()
      .finally(
        () => (
          this.setProfile({}), this.dbref.delete(), localStor.delete('myid')
        ),
      );
}

export const handleGoogleAuthUser = ({
  uid,
  email,
  displayName: name,
  photoURL,
  provider,
  providerData: prov,
}) => ({
  uid,
  email,
  name,
  photo: photoURL?.replace('=s96-c', '=s550') || null,
  provider:
    provider ||
    (!prov[0]
      ? null
      : prov[0].providerId.includes('google')
      ? 'google'
      : 'apple'),
});
