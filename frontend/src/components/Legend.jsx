import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const Legend = ({ grades, getColor }) => {
  const map = useMap();

  useEffect(() => {
    if (!grades.length) return;

    const legend = L.control({ position: "bottomright" });
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      grades.forEach((min, i) => {
        const max = grades[i + 1];
        div.innerHTML += `
          <i style="background:${getColor(min + 1)}"></i>
          ${min}${max ? `&ndash;${max}` : '+'}<br/>
        `;
      });
      return div;
    };

    legend.addTo(map);
    return () => legend.remove();
  }, [map, grades, getColor]);

  return null;
};

export default Legend;
