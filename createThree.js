import * as THREE from "https://code4fukui.github.io/three.js/build/three.module.js";

export const createThree = (parent) => {
  const w = parent.clientWidth;
  const h = parent.clientHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, w / h, 0.01, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(w, h);
  //renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.xr.enabled = true;
  parent.appendChild(renderer.domElement);

  // support resizing
  const onresize = () => {
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  addEventListener("resize", onresize);
  setTimeout(onresize, 10);

  // add lights
  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 0, 1);
  scene.add(directionalLight);

  // for AR
  camera.position.y = 1.4;

  return { THREE, scene, camera, renderer, ambientLight, directionalLight };
};
