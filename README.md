# London Bird Observation Explorer

this website provided a prototype of an exploring tool for birdwatcher using London bird observing data from e-Bird, which enable users to explore birdwatching hotspots and learn about different bird speies.


## Live Website

GitHub Pages:

[[https://[jianlingzhao.github.io](https://jianlingzhao.github.io)
## Features

The application provides two main exploration modes:

### Explore Mode

- Displays bird observations aggregated into spatial grid cells 
- Users can click a grid to get a popup, which includes:
  - Total observations in the grid
  - Number of species being observed in the range of the grid
  - Most commonly observed species in the grid
- Users can open a species information modal by clicking the button in the popup
- Users can switch directly to Track Mode for a selected species by clicking 'where to find' button

### Track Mode

- Displays individual observation points for a selected species
- Users can filter by:
  - Species (including both common name and scientific name)
  - Year of observation
  - Month of observation
- Users can click individual observations to view details, like date, location and species count

### Species Modal

Each species modal includes:

- Common name and scientific name for the bird species
- Image (from Wikimedia Commons)
- Audio recording of bird calls (if available on Wikimedia)
- Summary description of the bird
- A link to Wikipedia for exploring more information

### Location Tools

Users can:

- Locate themselves using browser geolocation
- Search a specific place using postcode


## Data Sources

### Bird Observation Data

Source:

eBird Basic Dataset (EBD)

Processed into
- Spatial grids (Explore Mode, including grid info and species info)
- Individual observations (Track Mode)


### Species Metadata

Source:

Wikimedia Commons  
Wikipedia API

Includes:
- Name (common & scientific)
- Images
- Audio recordings
- Species descriptions (summary)


### Base Map

Carto Positron

https://carto.com/


### Note

Observing data from e-Bird were uploaded by birdwatchers, so this website is not a tool for exploring species pattern, but for users to find out places that are best for birdwatching, and get to know more about bird species that can be fount in London. 

