import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/client";
import { useRouter } from "next/router";
const Nav = () => {
  const [session] = useSession();
  const [estado, setEstado] = useState("Iniciar Sesion");
  const [rol, setRol] = useState("");
  const router = useRouter();
  const estadoSession = (d) => {
    if (session !== undefined && session !== null) {
      if (
        session.user.name === "No autorizado" &&
        estado === "Iniciar Sesion"
      ) {
        alert("Verifique los datos ingresados no son validos ");
      } else if (
        session.user.name !== "No autorizado" &&
        estado === "Iniciar Sesion"
      ) {
        alert("Ingreso exitoso su rol es : " + session.user.name);
        setEstado("Salir");
        setRol(session.user.name);
      }
    }
    if (estado === "Salir") {
      signOut();
      alert("Salio de sesion");
      setEstado("Iniciar Sesion");
      setRol("");
    } else if (d === "2") {
      router.push("/Login");
    }
  };

  useEffect(() => {
    estadoSession("0");
  }, [session]);

  return (
    <div>
      <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <Link href="/">
            <a className="font-semibold text-xl tracking-tight">Gestion Covid-19</a>
          </Link>
        </div>

        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow">
            {rol === "admin" ? (
              <Link href="admin">
                <a className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                  Admin
                </a>
              </Link>
            ) : (
              <></>
            )}
            {rol === "ayudante" || rol==="admin" ? (
              <>
                <Link href="/RegistroCaso">
                  <a className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                    Registrar Caso
                  </a>
                </Link>
                <Link href="/GestionarCaso">
                  <a className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                    Gestionar Caso
                  </a>
                </Link>
              </>
            ) : (
              <></>
            )}
            {rol === "medico"  || rol==="admin"? (
              <>
                <Link href="/Modulo_Visualizacion/Busqueda">
                  <a className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                    Modulo Visualizacion Busqueda
                  </a>
                </Link>
                <Link href="/Modulo_Visualizacion/MapaGeneral">
                  <a className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                    Modulo Visualizacion Mapa General
                  </a>
                </Link>
              </>
            ) : (
              <></>
            )}
          </div>
          <div>
            <button
              className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
              type="button"
              onClick={() => {
                estadoSession("2");
              }}
            >
              {estado}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
