import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import axios from "axios";
const MapaGeneralContainer = dynamic(
  () => import("../../components/MapaGeneralContainer"),
  {
    ssr: false,
  }
);
const MapaGeneral = () => {
  const router = useRouter();
  const [session] = useSession();
  const [rol, setRol] = useState("");
  const [CasosRegistrados, setCasosRegistrados] = useState();
  const [coordenadas, setCoordenadas] = useState();
  useEffect(() => {
    if (session !== undefined && session !== null) {
      setRol(session.user.name);
    } else {
      setRol("");
      router.push("/");
    }
  }, [session]);

  const getCasosRegistrados = (data, e) => {
    axios
      .get("/api/getCasos")
      .then((response) => {
        if (response.status == 200) {
          setCasosRegistrados(response.data.general);
        } else {
          alert("Problemas al obtener los datos, intente nuevamente");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    getCasosRegistrados();
  }, []);

  useEffect(() => {
    if (CasosRegistrados !== undefined) {
      const ubicacion = CasosRegistrados.map((caso) => {
        return {
          residencia: [
            parseFloat(caso.latitud_residencia),
            parseFloat(caso.longitud_residencia),
          ],
          color: caso.color,
        };
      });
      console.log(ubicacion);
      setCoordenadas(ubicacion);
    }
  }, [CasosRegistrados]);

  return (
    <>
      {rol === "medico" || rol==="admin" ? (
        <MapaGeneralContainer coordenadas={coordenadas} />
      ) : (
        <h1>No tiene permisos</h1>
      )}
    </>
  );
};

export default MapaGeneral;
