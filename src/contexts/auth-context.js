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
  const initialized = useRef(false);
  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = window.localStorage.getItem("authenticated") === "true";
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      if (router.pathname === "/auth/login") {
        router.push("/");
      }
      const user = JSON.parse(window.localStorage.getItem("user"));

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user,
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
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
