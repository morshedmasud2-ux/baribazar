
import geoData from './bangladesh-geo.json';

export interface UpazilaOption {
  id: string;
  name: string;
  nameBn: string;
}

export interface DistrictOption {
  id: string;
  name: string;
  nameBn: string;
  popularAreas: UpazilaOption[];
  upazilas: UpazilaOption[];
}

export interface DivisionOption {
  id: string;
  name: string;
  nameBn: string;
  districts: DistrictOption[];
}

interface GeoUpazila {
  name: string;
  bn_name: string;
}

interface GeoDistrict {
  name: string;
  bn_name: string;
  upazilas: GeoUpazila[];
}

interface GeoDivision {
  name: string;
  bn_name: string;
  districts: GeoDistrict[];
}

const makeId = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const BANGLADESH_DIVISIONS: DivisionOption[] = (
  geoData as GeoDivision[]
).map((division) => ({
  id: makeId(division.name),
  name: division.name,
  nameBn: division.bn_name,
  districts: division.districts.map((district) => {
    const upazilas: UpazilaOption[] = (district.upazilas || []).map(
      (upazila) => ({
        id: makeId(upazila.name),
        name: upazila.name,
        nameBn: upazila.bn_name,
      })
    );

    return {
      id: makeId(district.name),
      name: district.name,
      nameBn: district.bn_name,
      upazilas,
      popularAreas: upazilas,
    };
  }),
}));
