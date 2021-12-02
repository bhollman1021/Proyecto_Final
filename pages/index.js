import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic.js";
const Froalacharts = dynamic(() => import("../components/froalacharts"), {
  ssr: false,
});
import axios from "axios";
export default function Home() {
  const [totalBarranquilla, setTotalBarranquilla] = useState();
  const [totalInfectados, setTotalInfectados] = useState();
  const [dataSource, setDataSourcer] = useState();

  const getCasosRegistrados = (data, e) => {
    axios
      .get("/api/getCasos")
      .then((response) => {
        if (response.status == 200) {
          setTotalBarranquilla({
            chart: {
              caption: "Casos Totales Barranquilla  ",
              theme: "froala",
              paletteColors: "#F7931A, #3c3c3d, #1A9DF6,#52AF94",
              numberPrefix: "#",
              defaultCenterLabel: "Total de casos",
              centerlabel: "$label<br>$value",
              doughnutRadius: "50%",
            },
            data: [
              {
                label: "Infectados",
                value: `${response.data.graficas.totales[0]}`,
              },
              {
                label: "Muertos",
                value: `${response.data.graficas.totales[1]}`,
              },
              {
                label: "Curados",
                value: `${response.data.graficas.totales[2]}`,
              },
            ],
          });

          setTotalInfectados({
            chart: {
              caption: "Infectados: examen positivo",
              theme: "froala",
              paletteColors: "#45CD0A,#AACD0A, #1A9DF6,#52AF94",
              numberPrefix: "#",
              defaultCenterLabel: "Total de casos positvios",
              centerlabel: "$label<br>$value",
              doughnutRadius: "50%",
            },
            data: [
              {
                label: "En tratamiento casa",
                value: `${response.data.graficas.infectados[0]}`,
              },
              {
                label: "En tratamiento hospital ",
                value: `${response.data.graficas.infectados[1]}`,
              },
              {
                label: "En UCI",
                value: `${response.data.graficas.infectados[2]}`,
              },
              {
                label: "Muertos",
                value: `${response.data.graficas.infectados[3]}`,
              },
            ],
          });
          setDataSourcer({
            chart: {
              caption: "Positivo y negativos",
              theme: "froala",
              paletteColors: "#0000ff, #ff0000",
              numberPrefix: "#",
              defaultCenterLabel: "Total de casos positivos",
              centerlabel: "$label<br>$value",
              doughnutRadius: "50%",
            },
            data: [
              {
                label: "Positivos",
                value: `${response.data.graficas.positivos_negativos[0]}`,
              },
              {
                label: "Negativos",
                value: `${response.data.graficas.positivos_negativos[1]}`,
              },
            ],
          });
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
  return (
    <div>
      <div>
        <div className="flex ">
          {totalInfectados && <Froalacharts dataSource={totalInfectados} />}
          {totalBarranquilla && <Froalacharts dataSource={totalBarranquilla} />}
        </div>
        <div className="flex justify-evenly ">
          {dataSource && <Froalacharts dataSource={dataSource} />}
        </div>
      </div>
    </div>
  );
}
