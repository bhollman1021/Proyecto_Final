import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import Geocode from "react-geocode";
Geocode.setLanguage("en");

Geocode.setApiKey("AIzaSyAeZrBfMPk96ZhCyZtwTsAASPBatqVdogw");
Geocode.setRegion("es");

Geocode.setLocationType("ROOFTOP");

Geocode.enableDebug();
const RegistroCaso = (e) => {
  const { register, handleSubmit } = useForm();
  const [session] = useSession();
  const router = useRouter();
  const [lat1, setLat1] = useState("0");
  const [lng1, setLng1] = useState("0");
  const [lat2, setLat2] = useState("0");
  const [lng2, setLng2] = useState("0");
  const [data, setData] = useState([]);

  const generarCoordenadas = (data, e) => {
    e.preventDefault();
    setData(data);

    Geocode.fromAddress(
      "Colombia Barranquilla" + data.direccion_residencia
    ).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setLat1(lat);
        setLng1(lng);
      },
      (error) => {
        setLat1("23");
        setLng1("33");
      }
    );
    Geocode.fromAddress("Colombia Barranquilla" + data.direccion_trabajo).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setLat2(lat);
        setLng2(lng);
      },
      (error) => {
        setLat2("23");
        setLng2("33");
      }
    );
  };
  const insert_caso = () => {
    data.latitud_residencia = lat1;
    data.longitud_residencia = lng1;
    data.latitud_trabajo = lat2;
    data.longitud_trabajo = lng2;
    data.codigo_caso = `${Math.ceil(Math.random() * 1000000)}`;

    axios
      .post("/api/insert_casos", data)
      .then((response) => {
        if (response.status == 200) {
          alert("Caso  correctamente ingresado");
        } else {
          alert("Problemas al ingresar los datos, intente nuevamente");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const [rol, setRol] = useState("");
  useEffect(() => {
    if (session !== undefined && session !== null) {
      setRol(session.user.name);
    } else {
      setRol("");
      router.push("/");
    }
  }, [session]);

  return (
    <div className="flex height-container justify-center items-center ">
      {rol === "ayudante" || rol==="admin"? (
        <>
          <form
            className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={handleSubmit(generarCoordenadas)}
          >
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Nombre
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-first-name"
                  type="text"
                  placeholder="Nombre"
                  {...register("nombre")}
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-last-name"
                >
                  Apellido
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-last-name"
                  type="text"
                  placeholder="Apellido"
                  {...register("apellido")}
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Cedula
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-first-name"
                  type="text"
                  placeholder="Cedula"
                  {...register("cedula")}
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <div className="relative items-center">
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-state"
                    {...register("sexo")}
                  >
                    <option selected disabled>
                      Escoger genero
                    </option>
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <input
                    datepicker
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder="Digite fecha nacimiento"
                    {...register("fecha_nacimiento")}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-last-name"
                >
                  Direccion residencia
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-last-name"
                  type="text"
                  placeholder="Direccion"
                  {...register("direccion_residencia")}
                />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-last-name"
                >
                  Direccion Trabajo
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-last-name"
                  type="text"
                  placeholder="Direccion"
                  {...register("direccion_trabajo")}
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-state"
                    {...register("resultado_examen")}
                  >
                    <option selected disabled>
                      Resultado Examen
                    </option>
                    <option value="positivo">Positivo</option>
                    <option value="negativo">Negativo</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <div className="relative items-center">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <input
                    datepicker
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder="Digite fecha  examen"
                    {...register("fecha_examen")}
                  />
                </div>
              </div>
            </div>

            <div className="flex  items-center justify-between">
              <div>
                <p>
                  Residencia:[{lat1},{lng1}]
                </p>
                <p>
                  Trabajo:[{lat2},{lng2}]
                </p>
              </div>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Generar Coordenadas
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  insert_caso();
                }}
              >
                Registrar Caso
              </button>
            </div>
          </form>
        </>
      ) : (
        <h1>No tiene permisos</h1>
      )}
    </div>
  );
};

export default RegistroCaso;
