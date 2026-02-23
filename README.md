# London Bird Observation Explorer

This website provided a prototype of an exploring tool for birdwatcher using London bird observing data from e-Bird, which enable users to explore birdwatching hotspots and learn about different bird species.


## Website

GitHub Pages:

[https://jianlingzhao.github.io](https://jianlingzhao.github.io)


## Data sources

- **Bird observation data**: eBird Basic Dataset. Version: EBD_relDec-2025. Cornell Lab of Ornithology, Ithaca, New York. Dec 2025. Region selected: London, UK.

- **Species images and audio recordings**: Wikimedia Commons (https://commons.wikimedia.org), under their respective open licenses.

- **Basemap tiles**: CARTO (https://carto.com) and OpenStreetMap contributors (https://www.openstreetmap.org).

- **Postcode geolocation services**: postcodes.io (https://postcodes.io).

The original dataset was cleaned, filtered, and restructured to support efficient spatial visualisation and interaction. Due to the large volume of observation records and the performance requirements of an interactive web application, different temporal subsets of the dataset were used for different interaction modes.

The Explore mode uses observation data **from 2021 to 2025**. The Track mode uses observation data **from 2023 to 2025**. This limitation was applied to maintain responsive interaction and efficient rendering of individual observation points, as Track mode requires displaying observation-level data.



## Instruction

The website provides two main exploration modes and some matching functions: 
- **Explore mode**: for discovering birdwatching hot-spot and learn more about the commonly observed species
- **Track mod**: for tracking specific time period and location for certain kinds of species
- **Location tools**: for users to centre the map on their current location, or search for a postcode to navigate to a specific area of interest

### Explore Mode

- Displays bird observations aggregated into spatial grid cells 
- Users can click a grid to get a popup, which includes:
  - Total observations in the grid
  - Number of species being observed in the range of the grid
  - Most commonly observed species in the grid
- Users can open a **species information modal** by clicking the 'View species info' button inside the popup
- Users can switch directly to Track Mode for further exploring for a selected species by clicking 'Where to Find Them' button inside the popup

### Track Mode

- Displays individual observation points for a selected species
- Users can filter by:
  - Species (including both common name and scientific name)
  - Year of observation
  - Month of observation
- Users can also open the **species information modal** by clicking the 'View Species Info' button inside the sidebar when a certain species is selected
- Users can click individual observations to get a popup to view the details of the observation record, like date, location and species count

### Species Modal

Each species modal includes:

- Common name and scientific name for the bird species
- Image (from Wikimedia Commons)
- Audio recording of bird calls (if available on Wikimedia)
- Summary description of the bird (a brief version less around 300 words)
- A link to Wikipedia for exploring more information

### Location Tools

Users can:

- Locate themselves using browser geolocation when clicking 'Find mu location' button
- Enter the postcode and search for the location point for a specific place

## Note

Observing data from e-Bird were uploaded by birdwatchers, so this website is not a tool for exploring species pattern, but for users to find out places that are best for birdwatching, and to get to know more about bird species that can be found in London. 


## AI/LLM Acknowledgement

This project was developed with the assistance of ChatGPT (OpenAI, GPT-5.2, https://chat.openai.com/) in an assistive role. AI was used to help explain technical concepts, assist with debugging, and provide example code snippets. All research design, data processing, and implementation decisions were made independently by the author.

