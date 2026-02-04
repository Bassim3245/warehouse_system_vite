// src/config.js
// LOCALHOST
// const apiUrl = import.meta.env.REACT_APP_BACKEND_URL;
// const apiUrlFile = import.meta.env.REACT_APP_BACKEND_URL_FILE;
// const apiUrlFileLog = import.meta.env.REACT_APP_BACKEND_URL_FILE_LOG;
// const apiUrl = "http://localhost:5000";
// const apiUrlFile = "http://localhost:5000";
// const apiUrlFileLog = "http://localhost:5000/logs";
// const apiUrl = "http://82.112.227.155:5001";
// const apiUrlFile = "http://82.112.227.155:5001";
// const apiUrlFileLog = "http://82.112.227.155:5001/logs";
// TETS DEMO
// const apiUrl = import.meta.env.REACT_APP_BACKEND_URL_DEMO;
// const apiUrlFile = import.meta.env.REACT_APP_BACKEND_URL_FILE_DEMO;
// const apiUrlFileLog = import.meta.env.REACT_APP_BACKEND_URL_FILE_LOG_DEMO;
// const apiUrl = "http://192.168.0.192:5000";
// const apiUrlFile = "http://192.168.0.192:5000";
// PRODUCTION LIVE
const apiUrl = import.meta.env.VITE_BACKEND_URL_PRODUCTION;
const apiUrlFile = import.meta.env.VITE_BACKEND_URL_FILE_PRODUCTION;
const apiUrlFileLog = import.meta.env.VITE_BACKEND_URL_LOG_PRODUCTION;
console.log("apiUrl" ,apiUrl);

const debug = import.meta.env.VITE_APP_DEBUG === "true";
const Cluster = import.meta.env.VITE_APP_CLUSTER;
const SecretKey = import.meta.env.VITE_APP_SECURITY_KEY;
const storageBucket = import.meta.env.VITE_APP_STORAGE_BUCKET;
export const config = {
  apiUrl,
  debug,
  Cluster,
  SecretKey,
  storageBucket,
  apiUrlFile,
  apiUrlFileLog,
};
