import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import PropTypes from "prop-types";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { getDatabase, ref, update, set } from "firebase/database";
import { useRouter } from "next/router";

import { app, auth } from "../guards/firebase";
import LoadingComponent from "../components/loader";

const db = getDatabase(app);

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
  START_LOADING: "START_LOADING",
  STOP_LOADING: "STOP_LOADING",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.START_LOADING]: (state) => {
    return {
      ...state,
      isLoading: true,
    };
  },
  [HANDLERS.STOP_LOADING]: (state) => {
    return {
      ...state,
      isLoading: false,
    };
  },
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && window.localStorage.getItem("authenticated") === "true") {
        if (router.pathname === "/auth/login") {
          router.push("/");
        }
        const user = JSON.parse(window.localStorage.getItem("user"));

        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: user,
        });
      } else {
        if (router.pathname !== "/auth/login") {
          router.push("/auth/login");
        }
        window.localStorage.setItem("authenticated", "false");
        dispatch({
          type: HANDLERS.INITIALIZE,
        });
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const signIn = (email, password) => {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const userData = {
            last_login: Date.now(),
          };
          update(ref(db, "users/" + user.uid), userData);
          router.push("/");
          window.localStorage.setItem("authenticated", "true");
          window.localStorage.setItem("user", JSON.stringify(user));
          dispatch({
            type: HANDLERS.SIGN_IN,
            payload: user,
          });
          resolve(user);
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  };

  const signOut = () => {
    auth.signOut();
    window.localStorage.setItem("authenticated", "false");
    window.localStorage.setItem("user", null);
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
    router.push("/auth/login");
  };

  const signUp = (full_name, email, password) => {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const userData = {
            email: email,
            password: password,
            full_name: full_name,
          };
          set(ref(db, "users/" + user.uid), userData);
          resolve("User created successfully");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  };

  if (state.isLoading) {
    return <LoadingComponent />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
