import { loginUrl } from "../constants/constants_url";
import {request} from "../constants/api";
// // import { useState } from "react";

// export const login = async (email: string, password: string ) => {
//   try {
//     const data = {
//           email: email,
//           password: password,
//       }
//     const res = await request(loginUrl,"post" ,data);
//     if (!res || !res.list) throw new Error("No data received");
//     // console.log(res);
//     if (res.status === 200) {
//       localStorage.setItem("token", res.data["data"]["access_token"]);
//       if (res.user){
//                   localStorage.setItem('id',res.user.id);
//                   localStorage.setItem('user_name',res.user.user_name);
//                   localStorage.setItem('email',res.user.email);
//                   if (res.user.staff){
//                       localStorage.setItem('image',res.user.staff.image);
//                       localStorage.setItem('phone',res.user.staff.phone);
//                   }
//               }
//       return res.data;
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   return null;
// };

export const login = async (email: string, password: string) => {
  try {
    const data = { email, password };

    const res = await request(loginUrl, "post", data);
    console.log("API response:", res);

    // If backend returns error format
    if (!res || res.status !== 200) {
      return { error: res?.message || "Invalid email or password" };
    }

    // Example backend structure: res.data.data.access_token
    const token = res.data?.data?.access_token;
    if (token) {
      localStorage.setItem("token", token);
    }

    if (res.user) {
      localStorage.setItem("id", res.user.id);
      localStorage.setItem("user_name", res.user.user_name);
      localStorage.setItem("email", res.user.email);

      if (res.user.staff) {
        localStorage.setItem("image", res.user.staff.image);
        localStorage.setItem("phone", res.user.staff.phone);
      }
    }

    return res; // return entire response on success

  } catch (error) {
    console.log("Login error:", error);
    return { error: "Network error" };
  }
};
