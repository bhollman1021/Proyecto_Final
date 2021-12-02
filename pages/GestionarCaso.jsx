import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { coolGray } from "tailwindcss/colors";
const GestionarCaso = () => {
  const [CasosRegistrados, setCasosRegistrados] = useState();
  const [casosRegistroFiltrados, setCasosRegistroFiltrados] = useState("");
  const [buscar, setBuscar] = useState("");
  const [tipoBusqueda, setTipoBusqueda] = useState("");
  const { register, handleSubmit } = useForm();
  const [casoSeleccionado, setCasoSeleccion] = useState("");
  const [cedulaSeleccionada, setcedulaSeleccionada] = useState("");
  const [ultimoEstado, setUltimoEstado] = useState("");
  const [session] = useSession();
  const router = useRouter();
  const getCasosRegistrados = (data, e) => {
    axios
      .get("/api/getCasos")
      .then((response) => {
        if (response.status == 200) {
          //   alert("Registro de caso cargado");
          console.log(response);
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
          //   alert("Registro de caso cargado");
          setCasoSeleccion(response.data.response);
          
          if (response.data.response.length > 0) {
            setUltimoEstado(
              response.data.response[response.data.response.length - 1].estado
            );
          } else {
            setUltimoEstado("");
          }
        } else {
          alert("Problemas al ingresar los datos, intente nuevamente");
        }
      })
      .catch((e) => {
        console.log(e);
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

  const actualizar_estado = (data, e) => {
    e.preventDefault();
    console.log(data);
    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);

    const data2 = {
      cedula: data.cedula,
      estado: data.estado,
      fecha_actualizacion: hoy.toLocaleDateString(),
    };

    axios
      .post(`/api/gestion/actualiza_estado/${cedulaSeleccionada}`, data2)
      .then((response) => {
        if (response.status == 200) {
          alert("Estado actualizado correctamente");
          getCasoSeleccionado(cedulaSeleccionada);
          console.log(response.data.response);
          console.log(response.data.response.length);
          if (response.data.response.length > 0) {
            setUltimoEstado(
              response.data.response[response.data.response.length - 1].estado
            );
          } else {
            setUltimoEstado("");
          }
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
    <div class="flex flex-col">
      {rol === "ayudante" || rol==="admin" ? (
        <>
          <div class="flex items-center justify-center  bg-white">
            <div class="col-span-12">
              <div class="overflow-auto lg:overflow-visible">
                <div class="flex lg:justify-between border-b-2 border-fuchsia-900 pb-1">
                  <h2 class="text-2xl text-gray-500 font-bold">
                    Casos Registrados
                  </h2>
                  <div class="text-center flex-auto ml-10 flex ">
                    <input
                      type="text"
                      name="name"
                      placeholder="Search..."
                      onChange={getParametrosFiltro}
                      class="
              w-1/3
              py-2
              border-b-2 border-blue-600
              outline-none
              focus:border-yellow-400
            "
                    />
                    <div class="relative ">
                      <select
                        class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-state"
                        onChange={getTipoBusqueda}
                      >
                        <option value="1">Codigo caso</option>
                        <option value="2">Nombre</option>
                        <option value="3">Cedula</option>
                        <option value="4">Cedula y Nombre</option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          class="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                    <button
                      class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="button"
                      onClick={() => {
                        filtrarRegistroCasos();
                      }}
                    >
                      Buscar
                    </button>
                  </div>
                </div>
                <table class="table text-gray-400 border-separate space-y-6 text-sm">
                  <thead class="bg-blue-500 text-white">
                    <tr>
                      <th class="p-3">Codigo</th>
                      <th class="p-3">Nombre</th>
                      <th class="p-3 text-left">Apellido</th>
                      <th class="p-3 text-left">Cedula</th>
                      <th class="p-3 text-left">Sexo</th>

                      <th class="p-3 text-left">F.nacimiento</th>
                      <th class="p-3 text-left">Dir.residencia</th>

                      <th class="p-3">Dir.trabajo</th>
                      <th class="p-3 text-left">Resultado</th>
                      <th class="p-3 text-left">Fecha</th>
                      <th class="p-3 text-left">Seleccionar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {casosRegistroFiltrados &&
                      casosRegistroFiltrados.map((dataCasosRegistrado) => {
                        return (
                          <tr key={dataCasosRegistrado.codigo_Caso}>
                            <td class="p-3 font-medium capitalize">
                              {dataCasosRegistrado.codigo_caso}
                            </td>

                            <td class="p-3 font-medium capitalize">
                              {dataCasosRegistrado.nombre}
                            </td>
                            <td class="p-3 font-medium capitalize">
                              {dataCasosRegistrado.apellido}
                            </td>
                            <td class="p-3 font-medium capitalize">
                              {dataCasosRegistrado.cedula}
                            </td>
                            <td class="p-3 font-medium capitalize">
                              {dataCasosRegistrado.sexo}
                            </td>
                            <td class="p-3 font-medium capitalize">
                              {dataCasosRegistrado.fecha_nacimiento}
                            </td>
                            <td class="p-3 font-medium capitalize">
                              {dataCasosRegistrado.direccion_residencia}
                            </td>
                            <td class="p-3 font-medium capitalize">
                              {dataCasosRegistrado.direccion_trabajo}
                            </td>
                            <td class="p-3 font-medium capitalize">
                              {dataCasosRegistrado.resultado_examen}
                            </td>
                            <td class="p-3 font-medium capitalize">
                              {dataCasosRegistrado.fecha_examen}
                            </td>

                            <td>
                              <button
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
          <div class="flex items-center justify-evenly  bg-whit">
            <form
              class="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              onSubmit={handleSubmit(actualizar_estado)}
            >
              <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    for="grid-first-name"
                  >
                    Cedula
                  </label>
                  <input
                    class="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-first-name"
                    type="text"
                    value={cedulaSeleccionada}
                    readOnly
                    {...register("cedula")}
                  />
                </div>
                <div class="w-full md:w-1/2 px-3">
                  {ultimoEstado === "Muerte" ? (
                    <></>
                  ) : (
                    <div class="relative">
                      {}
                      <select
                        class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-state"
                        {...register("estado")}
                      >
                        <option value="En Tratamiento Casa">
                          En Tratamiento Casa
                        </option>
                        <option value="En Tratamiento Hospital">
                          En Tratamiento Hospital
                        </option>
                        <option value="En UCI">En UCI</option>
                        <option value="Curado">Curado</option>
                        <option value="Muerte">Muerte</option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          class="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div class="flex  items-center justify-end">
                {ultimoEstado === "Muerte" ? (
                  <></>
                ) : (
                  <button
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Actualizar Estado
                  </button>
                )}
              </div>
            </form>

            <div>
              <table class="table text-gray-400 border-separate space-y-6 text-sm">
                <thead class="bg-blue-500 text-white">
                  <tr>
                    <th class="p-3">Fecha</th>
                    <th class="p-3 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {casoSeleccionado &&
                    casoSeleccionado.map((casoSeleccionado, i) => {
                      return (
                        <tr key={i}>
                          <td class="p-3 font-medium capitalize">
                            {casoSeleccionado.fecha_actualizacion}
                          </td>
                          <td class="p-3">{casoSeleccionado.estado}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <h1>No tiene acceso</h1>
      )}
    </div>
  );
};

export default GestionarCaso;
