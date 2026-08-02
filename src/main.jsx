import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import store from "./redux/store";
import { injectStore } from "./redux/api/axiosConfig";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.jsx";
import { ToastContainer } from "react-toastify";
import { Slide } from "react-toastify";

// Inject store into axiosConfig to break circular dependency
injectStore(store);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <I18nextProvider
        i18n={ // @ts-ignore
          i18n
        }
      >
        <App />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          transition={Slide}
          theme="light"
          limit={3}
          style={{
            top: '20px',
            zIndex: 9999,
          }}
          toastStyle={{
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            padding: '16px 20px',
            fontSize: '16px',
            fontWeight: '600',
          }}
          bodyClassName="text-right"
          progressStyle={{
            background: 'linear-gradient(to right, #1e3a8a, #2563eb)',
            height: '4px',
          }}
          closeButton={({ closeToast }) => (
            <button
              onClick={closeToast}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 bg-transparent border-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        />
      </I18nextProvider>
    </Provider>
  </StrictMode>,
)


