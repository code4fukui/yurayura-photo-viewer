import { createThree } from "./createThree.js";

export class YurayuraPhotoViewer extends HTMLElement {
  constructor(images) { // [{ file }]
    super();
    const { THREE, scene, camera, renderer } = createThree(this);

    const makeFlag = (options) => {
      // テクスチャー読み込み
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(options.file);
      const aspect = options.height / options.width;
      
      // 平面ジオメトリの生成
      const sw = 32;
      const sh = 32;
      options.freq2 = options.freq * 2;
      options.amp2 = options.amp;
      const size = options.size;
      const planeGeometry = new THREE.PlaneGeometry(size, size * aspect, sw, sh);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        //color: 0xFF0000, wireframe: true,
      });
      const mesh = new THREE.Mesh(planeGeometry, material);
      mesh.animate = (t) => {
        // メッシュのジオメトリをリアルタイムで変更
        const p = mesh.geometry.attributes.position;
        const a = p.array;
        const t2 = t * options.tspeed;
        for (let i = 0; i <= sw; i++) {
          for (let j = 0; j <= sh; j++) {
            const z =
              Math.cos(options.th + t2 + i * options.freq) * options.amp +
              Math.cos(options.th + t2 + j * options.freq2) * options.amp2;
            a[2 + i * 3 + (sw + 1) * 3 * j] = z;
          }
        }
        p.needsUpdate = true;

        // 場所設定
        t = 0;
        /*
        const th = mesh.th + t * options.speed;
        mesh.position.x = Math.cos(th) * mesh.r;
        mesh.position.z = Math.sin(th) * mesh.r;
        mesh.rotation.y = Math.atan2(mesh.position.x, mesh.position.z) - Math.PI;
        */
      };
      return mesh;
    };

    const imggap = 1.9;
    const opts = [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const opt = {
        file: img.file,
        freq: (Math.random() * 0.2 + 0.4) / 8,
        amp: 0.04,
        width: img.width,
        height: img.height,
        size: 3,
        tspeed: 0.001,
        th: Math.random() * 2 * Math.PI,
      };
      const obj = makeFlag(opt);
      scene.add(obj);
      obj.position.y = -0.2 + (i - 3) * imggap; //Math.random() * 1.5;// + .5;
      obj.position.z = -2.3;
      obj.position.x = 0.4;
      //fish.r = Math.random() * 3 + .5;
      //fish.th = Math.random() * Math.PI * 2;
      opts.push(obj);
    }

    const scrt = 4 * 1000;

    // camera
    camera.rotation.x = 0.1;
    camera.rotation.y = 0.2;
    camera.rotation.z = .2;

    const t0 = performance.now();
    renderer.setAnimationLoop(() => {
      const t = performance.now() - t0;
      const t2 = t % scrt;
      for (const img of opts) {
        img.animate(t);
        if (t2 > scrt - 1000) {
          if (img.bky === undefined) {
            img.bky = img.position.y;
          }
          const t3 = t2 - (scrt - 1000);
          img.position.y = img.bky + Math.sin(t3 / 1000 * Math.PI / 2) * imggap;
        } else {
          if (img.bky !== undefined) {
            img.position.y = img.bky + imggap;
            if (img.position.y > 8) {
              img.position.y -= imggap * images.length;
            }
            img.bky = undefined;
          }
        }
      }
      renderer.render(scene, camera);
    });
  }
}

customElements.define("yurayura-photo-viewer", YurayuraPhotoViewer);
