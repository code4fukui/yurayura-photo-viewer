# yurayura-photo-viewer

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A Web Component to display photos with a gentle, undulating "yurayura" (swaying) effect using Three.js. Images are rendered as 3D planes with a vertex animation, creating a dynamic, flag-like motion. It's designed to be simple to integrate and supports AR environments.

## Demo

- [Live Example](https://code4fukui.github.io/yurayura-photo-viewer/)

## Features

-   **Waving Animation**: Displays static images with a dynamic, wavy motion.
-   **Web Component**: Packaged as a simple, reusable `<yurayura-photo-viewer>` element.
-   **Dynamic Data**: Easily loads image data from external sources like CSV files.
-   **Continuous Cycle**: Cycles through a collection of photos in a continuous vertical loop.
-   **Metadata Callback**: Provides an `onchange` callback to track the currently featured photo.
-   **AR Ready**: Includes an AR-compatible scene and camera setup.

## Usage

1.  **Add the component to your HTML.**

    ```html
    <!-- Set a container for the viewer -->
    <div id="viewer-container" style="width: 100vw; height: 100vh;"></div>

    <!-- An element to display photo info -->
    <div id="photo-info"></div>
    ```

2.  **Import and initialize the component in your JavaScript module.**

    ```javascript
    import { YurayuraPhotoViewer } from "./yurayura-photo-viewer.js";
    import { CSV } from "https://js.sabae.cc/CSV.js";

    // 1. Create and append the component
    const viewer = new YurayuraPhotoViewer();
    document.getElementById("viewer-container").appendChild(viewer);

    // 2. Configure the viewer
    viewer.setAttribute("duration", "6000"); // Cycle every 6 seconds

    // 3. Set a callback to display info for the active photo
    const infoDiv = document.getElementById("photo-info");
    viewer.onchange = (photoData) => {
      console.log("Current photo:", photoData);
      infoDiv.innerHTML = `
        <a href="${photoData.url}">
          ${photoData.title} by ${photoData.author}
        </a>
      `;
    };

    // 4. Load image data and assign it to the viewer
    async function loadImages() {
      const imageList = await CSV.fetchJSON("https://code4fukui.github.io/find47/find47images.csv");
      
      const images = imageList.slice(0, 100).map(d => ({
        file: `~~https://code4fukui.github.io/find47/photo/${d.id}.jpg`~~ *(unavailable)*,
        width: 960,  // Original image width for aspect ratio
        height: 540, // Original image height
        data: d      // Pass through original metadata for the onchange callback
      }));

      viewer.value = images;
    }

    loadImages();
    ```

## API: `<yurayura-photo-viewer>`

### Properties

-   **`.value = [imageObjects]`**
    Sets the photos to display. `imageObjects` is an array where each object must have the following keys:
    -   `file` (string): URL to the image file.
    -   `width` (number): The original width of the image for correct aspect ratio calculation.
    -   `height` (number): The original height of the image.
    -   `data` (any, optional): Any associated metadata (e.g., the original CSV row)