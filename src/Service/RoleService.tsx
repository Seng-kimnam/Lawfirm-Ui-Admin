import { deleteRoleUrl, getRoleUrl, postRoleUrl, putRoleUrl } from "../constants/constants_url";
import { request } from "../constants/api";
import { useEffect, useState } from "react";
import { Roles } from "../model/Roles";


// Fetch Get Roles
export const getRoles = () => {
  const [list, setList] = useState<Roles[]>([]);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const res = await request(getRoleUrl, "GET", undefined, {
        Authorization: `Bearer ${token}`,
      });

      setList(res?.payload || []);
    } catch (error: any) {
      console.error("Failed to fetch roles:", error.response?.status, error.message);
      setList([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { list, refetch: fetchData };
};

// Fetch Add Roles
export const postRole = async (req: Roles) => {
  try {
    const response = await request(postRoleUrl, "POST", req ,{
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    if (response.status === 200) {
      return response.data; 
    }
  } catch (error) {
    alert(Error);
  }
};

// Update Roles
export const putRole = async (req: Roles) => {
  try {
    if (!req.roleId) {
      throw new Error("Role ID is required for update");
    }
    const response = await request(putRoleUrl + req.roleId, "PUT", req, {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    alert(error.response?.data?.message || error.message || "Something went wrong");
  }
};

// Delete Roles
export const deleteRole = async (roleId: Number) => {
  try {
    if (!roleId) {
      throw new Error("Role ID is required for delete");
    }
    const response = await request(deleteRoleUrl + roleId, "DELETE", undefined, {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
   
    
    if (response.status === 200) {
     console.log("Delete successful" , response);
     return response;
    }
  } catch (error: any) {
    alert(error.response?.data?.message || error.message || "Something went wrong");
  }
};