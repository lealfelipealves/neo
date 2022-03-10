import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Container } from "./styles";

interface links {
  next?: string;
  prev?: string;
  self: string;
}

interface nearObjects {
  absolute_magnitude_h: number;
  id: string;
  is_potentially_hazardous_asteroid: boolean;
  is_sentry_object: boolean;
  links: links;
  name: string;
  nasa_jpl_url: string;
  neo_reference_id: string;
}

interface nearEarthObjects {
  [date: string]: nearObjects[];
}

interface Neo {
  'element_count': number;
  'links': links[];
  'near_earth_objects': nearEarthObjects;
}

export function NeoTable() {
  const [nearEarthObjects, setNearEarthObjects] = useState<nearObjects[]>();

  useEffect(() => {
    api.get('neo/rest/v1/feed', { 
      params: {
        'start_date': '2022-01-01',
        'end_date': '2022-01-08',
        'api_key': process.env.REACT_APP_NASA_API_KEY
      } 
    })
      .then((response) =>{
        setNearEarthObjects(response.data.near_earth_objects['2022-01-01']);
      })
  }, []);

  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
          </tr>
        </thead>

        <tbody>
        {nearEarthObjects && nearEarthObjects.map((nearEarthObject) => (
          <tr key={nearEarthObject.id} >
            <td>{nearEarthObject.name}</td>
            <td>
              <button 
              type="button" 
              onClick={() => alert(nearEarthObject.name)}
              >
                Detalhes
              </button>
            </td>
          </tr> 
        ))}     
        </tbody>
      </table>
    </Container>
  );
}