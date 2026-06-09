import type { WoodSpecies, WoodSpeciesId } from './types';

export const WOOD_SPECIES: readonly WoodSpecies[] = [
  { id: 'oak', label: 'Oak', btuPerCordMillions: 26.4 },
  { id: 'hickory', label: 'Hickory', btuPerCordMillions: 25.5 },
  { id: 'black-locust', label: 'Black Locust', btuPerCordMillions: 26.8 },
  { id: 'apple', label: 'Apple', btuPerCordMillions: 26.5 },
  { id: 'ash', label: 'Ash', btuPerCordMillions: 23.6 },
  { id: 'birch', label: 'Birch', btuPerCordMillions: 20.8 },
  { id: 'maple', label: 'Maple', btuPerCordMillions: 25.5 },
  { id: 'douglas-fir', label: 'Douglas Fir', btuPerCordMillions: 20.7 },
  { id: 'lodgepole-pine', label: 'Lodgepole Pine', btuPerCordMillions: 15.9 },
  { id: 'ponderosa-pine', label: 'Ponderosa Pine', btuPerCordMillions: 16.2 },
  { id: 'larch-tamarack', label: 'Larch / Tamarack', btuPerCordMillions: 22.3 },
  { id: 'aspen', label: 'Aspen', btuPerCordMillions: 13.4 },
] as const;

const SPECIES_BY_ID = new Map(WOOD_SPECIES.map((species) => [species.id, species]));

export function getWoodSpecies(id: WoodSpeciesId): WoodSpecies {
  const species = SPECIES_BY_ID.get(id);
  if (!species) {
    throw new Error(`Unknown wood species: ${id}`);
  }
  return species;
}

export function isWoodSpeciesId(value: string): value is WoodSpeciesId {
  return SPECIES_BY_ID.has(value as WoodSpeciesId);
}
