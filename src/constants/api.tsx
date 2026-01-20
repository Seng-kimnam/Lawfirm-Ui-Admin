// import axios, {Method} from "axios";
// import {base_Url} from "./constants_url";

// export const request = (url:string, method:Method, data?:object) => {
//     const headers = {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//     };
//     return axios({
//         url: base_Url + url,
//         method: method,
//         data: data,
//         headers: headers,
//     }).then((response) => {
//         // Check if the response status is 200 OK
//         return response.data;
//     }).catch((error) => {
//         // Handle errors appropriately
//         console.error("API request failed:", error);
//     });
// };

import axios, { Method } from "axios";
import { base_Url } from "./constants_url";

export const request = (
  url: string,
  method: Method,
  data?: object,
  params?: object,
  contentType?: string,
) => {
  const token = localStorage.getItem("token");
  // console.log("token", token);
  const headers: any = {
    "Content-Type": contentType || "application/json",
    Accept: "application/json",
  };

  // Automatically add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return axios({
    url: base_Url + url,
    method: method,
    data: data,
    params: params,
    headers: headers,
  })
    .then((response) => {
      console.log("res api " , response)
     return response.data;
    
    })
    .catch((error) => {
      throw error; // so caller can catch it
    });
};
