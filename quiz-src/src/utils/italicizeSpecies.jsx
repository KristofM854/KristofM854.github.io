import { Fragment } from 'react'

// List of species/genus names that should be italicized in quiz text.
// Add new names as needed — order doesn't matter.
const SPECIES_NAMES = [
  // Dinoflagellates
  'Alexandrium fundyense', 'Alexandrium mediterraneum', 'Alexandrium tamarense',
  'Alexandrium pacificum', 'Alexandrium australiense',
  'Alexandrium catenella', 'Alexandrium minutum', 'Alexandrium ostenfeldii',
  'Alexandrium', 'Azadinium spinosum', 'Azadinium',
  'Dinophysis acuminata', 'Dinophysis acuta', 'Dinophysis fortii', 'Dinophysis',
  'Gambierdiscus', 'Gymnodinium catenatum', 'Gymnodinium',
  'Karenia brevis', 'Karenia', 'Lingulodinium polyedra', 'Lingulodinium',
  'Prorocentrum lima', 'Prorocentrum', 'Pyrodinium bahamense', 'Pyrodinium',
  'Mesodinium rubrum', 'Myrionecta rubra',
  // Diatoms
  'Pseudo-nitzschia australis', 'Pseudo-nitzschia multiseries', 'Pseudo-nitzschia seriata',
  'Pseudo-nitzschia pungens', 'Pseudo-nitzschia',
  'Nitzschia pungens',
  // Cyanobacteria
  'Microcystis aeruginosa', 'Microcystis', 'Dolichospermum', 'Anabaena',
  'Cylindrospermopsis raciborskii', 'Cylindrospermopsis', 'Raphidiopsis',
  'Planktothrix', 'Aphanizomenon', 'Nodularia spumigena', 'Nodularia',
  'Prymnesium',
  // Cryptophytes / ciliates
  'Teleaulax', 'Plagioselmis',
  // Shellfish / animals
  'Mytilus edulis', 'Mytilus galloprovincialis', 'Mytilus',
  'Crassostrea virginica', 'Crassostrea gigas', 'Crassostrea',
  'Mya arenaria', 'Placopecten magellanicus',
  'Saxidomus gigantea', 'Saxidomus',
  'Zalophus californianus', 'Enhydra lutris',
  'Tursiops truncatus', 'Eschrichtius robustus',
  // General biological terms that are species names
  'Vibrio',
]

// Sort by length descending so longer names match first (e.g. "Pseudo-nitzschia australis" before "Pseudo-nitzschia")
const SORTED_NAMES = [...SPECIES_NAMES].sort((a, b) => b.length - a.length)

// Build a regex that matches any species name as a whole word
const SPECIES_REGEX = new RegExp(
  `(${SORTED_NAMES.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
  'g'
)

/**
 * Takes a string and returns a React fragment with species names wrapped in <em>.
 */
export function italicizeSpecies(text) {
  if (!text || typeof text !== 'string') return text

  const parts = text.split(SPECIES_REGEX)
  if (parts.length === 1) return text

  const nameSet = new Set(SORTED_NAMES)
  return (
    <>
      {parts.map((part, i) =>
        nameSet.has(part) ? (
          <em key={i} className="italic">{part}</em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  )
}
