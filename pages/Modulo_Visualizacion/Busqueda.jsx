import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import axios from "axios";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
const MapaBusqueda = dynamic(() => import("../../components/MapaBusqueda"), {
  ssr: false,
});

const Busqueda = () => {
  const [CasosRegistrados, setCasosRegistrados] = useState();
  const [casosRegistroFiltrados, setCasosRegistroFiltrados] = useState("");
  const [buscar, setBuscar] = useState("");
  const [tipoBusqueda, setTipoBusqueda] = useState("");
  const router = useRouter();
  const [coordenadas, setCoordenadas] = useState("");
  const [casoSeleccionado, setCasoSeleccion] = useState("");
  const [cedulaSeleccionada, setcedulaSeleccionada] = useState("");
  const [session] = useSession();

  const getCasosRegistrados = (data, e) => {
    axios
      .get("/api/getCasos")
      .then((response) => {
        if (response.status == 200) {
          //   alert("Registro de caso cargado");
          setCasosRegistrados(response.data.DatosCasosRegistrados);
          setCasosRegistroFiltrados(response.data.DatosCasosRegistrados);
        } else {
          alert("Problemas al ingresar los datos, intente nuevamente");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getCasoSeleccionado = (cedula) => {
    setcedulaSeleccionada(cedula);

    axios
      .get(`/api/gestion/getSeleccion/${cedula}`)
      .then((response) => {
        if (response.status == 200) {
          setCasoSeleccion(response.data.response);
        } else {
          alert("Problemas al ingresar los datos, intente nuevamente");
        }
      })
      .catch((e) => {
        console.log(e);
      });

    const dataCaso = CasosRegistrados.filter((caso) => caso.cedula === cedula);

    setCoordenadas({
      residencia: [
        parseFloat(dataCaso[0].latitud_residencia),
        parseFloat(dataCaso[0].longitud_residencia),
      ],
      trabajo: [
        parseFloat(dataCaso[0].latitud_trabajo),
        parseFloat(dataCaso[0].longitud_trabajo),
      ],
    });
  };

  useEffect(() => {
    getCasosRegistrados();
  }, []);

  const getParametrosFiltro = (e) => {
    setBuscar(e.target.value);
  };

  const getTipoBusqueda = (e) => {
    setTipoBusqueda(e.target.value);
  };
  const filtrarRegistroCasos = () => {
    console.log(buscar);
    const casosFiltrados = CasosRegistrados.filter((casoRegistro) => {
      if (buscar === "") {
        return { CasosRegistrados };
      } else if (
        casoRegistro.cedula.toLowerCase().includes(buscar.toLowerCase()) &&
        tipoBusqueda === "1"
      ) {
        return casoRegistro;
      } else if (
        casoRegistro.nombre.toLowerCase().includes(buscar.toLowerCase()) &&
        tipoBusqueda === "2"
      ) {
        return casoRegistro;
      } else if (
        casoRegistro.cedula.toLowerCase().includes(buscar.toLowerCase()) &&
        tipoBusqueda === "3"
      ) {
        return casoRegistro;
      } else if (
        (casoRegistro.cedula.toLowerCase().includes(buscar.toLowerCase()) ||
          casoRegistro.nombre.toLowerCase().includes(buscar.toLowerCase())) &&
        tipoBusqueda === "4"
      ) {
        return casoRegistro;
      }
    });
    setCasosRegistroFiltrados(casosFiltrados);
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
    <div>
      {rol === "medico"|| rol==="admin" ? (
        <>
          <div className="flex items-center justify-center mt-5 bg-white">
            <div className="col-span-12">
              <div className="overflow-auto lg:overflow-visible">
                <div className="flex lg:justify-between border-b-2 border-fuchsia-900 pb-1">
                  <h2 className="text-2xl text-gray-500 font-bold">
                    Casos Registrados
                  </h2>
                  <div className="text-center flex-auto ml-10 flex ">
                    <input
                      type="text"
                      name="name"
                      placeholder="Search..."
                      onChange={getParametrosFiltro}
                      className="
              w-1/3
              py-2
              border-b-2 border-blue-600
              outline-none
              focus:border-yellow-400
            "
                    />
                    <div className="relative ">
                      <select
                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-state"
                        onChange={getTipoBusqueda}
                      >
                        <option value="1">Codigo caso</option>
                        <option value="2">Nombre</option>
                        <option value="3">Cedula</option>
                        <option value="4">Cedula y Nombre</option>
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
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="button"
                      onClick={() => {
                        filtrarRegistroCasos();
                      }}
                    >
                      Buscar
                    </button>
                  </div>
                </div>
                <table className="table text-gray-400 border-separate space-y-6 text-sm">
                  <thead className="bg-blue-500 text-white">
                    <tr>
                      <th className="p-3">Codigo</th>
                      <th className="p-3">Nombre</th>
                      <th className="p-3 text-left">Apellido</th>
                      <th className="p-3 text-left">Cedula</th>
                      <th className="p-3 text-left">Sexo</th>

                      <th className="p-3 text-left">F.nacimiento</th>
                      <th className="p-3 text-left">Dir.residencia</th>

                      <th className="p-3">Dir.trabajo</th>
                      <th className="p-3 text-left">Resultado</th>
                      <th className="p-3 text-left">Fecha</th>
                      <th className="p-3 text-left">Seleccionar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {casosRegistroFiltrados &&
                      casosRegistroFiltrados.map((dataCasosRegistrado) => {
                        return (
                          <tr key={dataCasosRegistrado.codigo_Caso}>
                            <td className="p-3 font-medium capitalize">
                              {dataCasosRegistrado.codigo_caso}
                            </td>

                            <td className="p-3 font-medium capitalize">
                              {dataCasosRegistrado.nombre}
                            </td>
                            <td className="p-3 font-medium capitalize">
                              {dataCasosRegistrado.apellido}
                            </td>
                            <td className="p-3 font-medium capitalize">
                              {dataCasosRegistrado.cedula}
                            </td>
                            <td className="p-3 font-medium capitalize">
                              {dataCasosRegistrado.sexo}
                            </td>
                            <td className="p-3 font-medium capitalize">
                              {dataCasosRegistrado.fecha_nacimiento}
                            </td>
                            <td className="p-3 font-medium capitalize">
                              {dataCasosRegistrado.direccion_residencia}
                            </td>
                            <td className="p-3 font-medium capitalize">
                              {dataCasosRegistrado.direccion_trabajo}
                            </td>
                            <td className="p-3 font-medium capitalize">
                              {dataCasosRegistrado.resultado_examen}
                            </td>
                            <td className="p-3 font-medium capitalize">
                              {dataCasosRegistrado.fecha_examen}
                            </td>

                            <td>
                              <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={() => {
                                  getCasoSeleccionado(
                                    dataCasosRegistrado.cedula
                                  );
                                }}
                              >
                                Selec
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="flex justify-evenly ">
            <div>
              <table className="table text-gray-400 border-separate space-y-6 text-sm">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="p-3">Fecha</th>
                    <th className="p-3 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {casoSeleccionado &&
                    casoSeleccionado.map((casoSeleccionado, i) => {
                      return (
                        <tr key={i}>
                          <td className="p-3 font-medium capitalize">
                            {casoSeleccionado.fecha_actualizacion}
                          </td>
                          <td className="p-3">{casoSeleccionado.estado}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <MapaBusqueda coordenadas={coordenadas} />
          </div>
        </>
      ) : (
        <h1>No tiene permisos</h1>
      )}
    </div>
  );
};

export default Busqueda;
