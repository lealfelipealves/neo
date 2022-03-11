import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Container } from "./styles";
import { format } from 'date-fns';
import ptBrLocale from 'date-fns/locale/pt-BR'
interface links {
  next?: string;
  prev?: string;
  self: string;
}
interface closeApproachData {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  orbiting_body: string;
}
interface estimatedValue{
  estimated_diameter_max: number;
  estimated_diameter_min: number;
}
interface estimatedDiameter {
  feet: estimatedValue;
  kilometers: estimatedValue;
  meters: estimatedValue;
  miles: estimatedValue;
}
interface nearObjects {
  absolute_magnitude_h: number;
  close_approach_data: closeApproachData[]
  estimated_diameter: estimatedDiameter;
  id: string;
  is_potentially_hazardous_asteroid: boolean;
  is_sentry_object: boolean;
  links: links;
  name: string;
  nasa_jpl_url: string;
  neo_reference_id: string;
}
interface orbitClass {
  orbit_class_description: string;
  orbit_class_range: string;
  orbit_class_type: string;
}
interface orbitalData {
  aphelion_distance: string;
  ascending_node_longitude: string;
  data_arc_in_days: number;
  eccentricity: string;
  epoch_osculation: string;
  equinox: string;
  first_observation_date: string;
  inclination: string;
  jupiter_tisserand_invariant: string;
  last_observation_date: string;
  mean_anomaly: string;
  mean_motion: string;
  minimum_orbit_intersection: string;
  observations_used: number;
  orbit_class: orbitClass;
  orbit_determination_date: string;
  orbit_id: string;
  orbit_uncertainty: string;
  orbital_period: string;
  perihelion_argument: string;
  perihelion_distance: string;
  perihelion_time: string;
  semi_major_axis: string;
}
interface neo extends nearObjects {
  designation: string;
  orbital_data: orbitalData;
}
interface nearEarthObjects {
  [date: string]: nearObjects[];
}
interface feedz {
  element_count: number;
  links: links[];
  near_earth_objects: nearEarthObjects;
}

export function NeoTable() {
  const [neo, setNeo] = useState<nearEarthObjects>();
  const [nearEarthObjects, setNearEarthObjects] = useState<nearObjects[]>();


  function getDateFormat(date: string) {
    const today = new Date(date);
    const formattedDate = format(today, "EEEE, dd 'de' MMMM 'de' yyyy", {
      locale: ptBrLocale
    });
    return formattedDate;
  }

  function getNeo(id: string) {
    api.get(`neo/rest/v1/neo/${id}`, {
      params: {
        'api_key': process.env.REACT_APP_NASA_API_KEY
      }
    })
    .then((response)=> {
      alert(getDateFormat(response.data.close_approach_data[0].close_approach_date));
    })
  }

  function getDanger() {
    api.get('neo/rest/v1/feed', { 
      params: {
        'start_date': '2015-09-08',
        'end_date': '2015-09-08',
        'api_key': process.env.REACT_APP_NASA_API_KEY
      } 
    })
      .then((response) =>{
        setNearEarthObjects(response.data.near_earth_objects['2015-09-08']
        .filter((item: nearObjects) => item.is_potentially_hazardous_asteroid === true));	
      })
  }

  /*useEffect(() => {
    api.get('neo/rest/v1/feed', { 
      params: {
        'start_date': '2022-01-01',
        'end_date': '2022-01-08',
        'api_key': process.env.REACT_APP_NASA_API_KEY
      } 
    })
      .then((response) =>{
        setNeo(response.data.near_earth_objects)
        setNearEarthObjects(response.data.near_earth_objects['2022-01-01']);

        if(neo) {
          //console.log(Object.keys(neo))
          //Object.keys(neo).map((date) => {
          //}))
          
          Object.entries(neo).map(([date, nearObjects]) => {
            console.log(date, nearObjects)
            console.log(nearObjects)
          })
        }
      })
  }, []);*/

  return (
    <Container>
      <button
        type="button"
        onClick={() => getDanger()}
      >
        Listar Objetos de ameaça
      </button>
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
                onClick={() => getNeo(nearEarthObject.id)}
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