import React, { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateDocument = ({ setAuth }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const docUpdate = async () => {
    var token = localStorage.token;
    var decoded = jwt_decode(token);

    console.log(decoded);
    // localStorage.removeItem("token");
    if (!localStorage.token) {
      navigate("/login", { state: { id: id } });
      console.log(id);
    }
    const position = decoded.user.email === "000000" ? "Senior Manager" : null;
    const update = await axios.put(
      `http://localhost:5000/api/v1/docs/update/${id}`,
      { position },
      {
        headers: {
          token: localStorage.token,
        },
      }
    );
    console.log("ISI UPDATE DOKUMEN: ", update);

    navigate("/");
    toast.success("Dokumen berhasil di update.", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  useEffect(() => {
    docUpdate();
  }, []);

  //Buat login baru disini
  //saat submit login, hit API login dan update
  //jika login pakai email tertentu, update posisi dokumen
  //redirect ke halaman dashboard

  return <></>;
};

export default UpdateDocument;
