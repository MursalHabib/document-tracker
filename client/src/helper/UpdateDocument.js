import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useParams, useNavigate } from "react-router-dom";

const UpdateDocument = ({ setAuth }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const docUpdate = () => {
    var token = localStorage.token;
    var decoded = jwt_decode(token);

    console.log(decoded);
    localStorage.removeItem("token");
    navigate("/login", { state: { id: id } });
    console.log(id);
    setAuth(false);
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
