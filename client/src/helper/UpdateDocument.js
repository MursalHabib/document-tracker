import React, { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, CircularProgress } from "@mui/material";

const UpdateDocument = ({ setAuth }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const docUpdate = async () => {
    // localStorage.removeItem("token");
    if (!localStorage.token) {
      navigate("/login", { state: { id: id } });
    }
    if (localStorage.token) {
      var token = localStorage.token;
      var decoded = jwt_decode(token);
      console.log(decoded);
      const position =
        decoded.user.email === "000000" ? "Senior Manager" : null;
      const update = await axios.put(
        `${BASE_URL}/api/v1/docs/update/${id}`,
        { position },
        {
          headers: {
            token: localStorage.token,
          },
        }
      );
      console.log("ISI UPDATE DOKUMEN: ", update);

      navigate("/");
      toast.success("Berhasil update posisi dokumen", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    docUpdate();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    </>
  );
};

export default UpdateDocument;
