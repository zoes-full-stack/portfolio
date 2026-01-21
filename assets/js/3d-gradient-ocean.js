"use strict";

/* globals THREE, gsap, $ */

let camera, scene, renderer;
let plane;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2(-100, -100); // initially offscreen

const baseColorRGB = { r: 0, g: 52, b: 74 };
const baseColor = `rgb(${baseColorRGB.r},${baseColorRGB.g},${baseColorRGB.b})`;

let nearStars, farStars, farthestStars;
let timer = 0;

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Lights
    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(0, 1, 1).normalize();
    scene.add(topLight);

    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.4);
    bottomLight.position.set(1, -1, 1).normalize();
    scene.add(bottomLight);

    const skyLights = [0,1,2].map(() => new THREE.DirectionalLight(0x666666, 0.2));
    skyLights[0].position.set(-1, -1, 0.2).normalize();
    skyLights[1].position.set(0, -1, 0.2).normalize();
    skyLights[2].position.set(1, -1, 0.2).normalize();
    skyLights.forEach(l => scene.add(l));

    // Plane with BufferGeometry
    const size = 400;
    const segments = 70;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    const material = new THREE.MeshPhongMaterial({
        vertexColors: true,
        flatShading: true,
        side: THREE.DoubleSide
    });

    // Assign base color per vertex
    const colors = [];
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
        colors.push(baseColorRGB.r / 255, baseColorRGB.g / 255, baseColorRGB.b / 255);
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Store random data for animation
    const vertexData = [];
    for (let i = 0; i < position.count; i++) {
        vertexData.push({
            dx: Math.random() - 0.5,
            dy: Math.random() - 0.5,
            randomDelay: Math.random() * 5
        });
    }

    plane = new THREE.Mesh(geometry, material);
    plane.userData.vertexData = vertexData;
    scene.add(plane);

    // Stars
    farthestStars = createStars(1200, 420, "#0952BD");
    farStars = createStars(1200, 370, "#A5BFF0");
    nearStars = createStars(1200, 290, "#118CD6");

    scene.add(farthestStars, farStars, nearStars);
    farStars.rotation.x = 0.25;
    nearStars.rotation.x = 0.25;

    // Events
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("mousemove", onMouseMove);

    // GSAP buttons
    setupButtons();
}

// ---------------------
// Stars helper
// ---------------------
function createStars(amount, y, color) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < amount; i++) {
        vertices.push((Math.random() - 0.5) * 1500);
        vertices.push(y);
        vertices.push((Math.random() - 0.5) * 1500);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color, size: 1, transparent: true });
    return new THREE.Points(geometry, material);
}

// ---------------------
// Animation
// ---------------------
function animate() {
    requestAnimationFrame(animate);

    timer += 0.01;

    // Animate plane vertices
    const pos = plane.geometry.attributes.position;
    const vertexData = plane.userData.vertexData;
    for (let i = 0; i < pos.count; i++) {
        pos.setX(i, pos.getX(i) + Math.sin(timer + vertexData[i].randomDelay)/40 * vertexData[i].dx);
        pos.setY(i, pos.getY(i) + Math.sin(timer + vertexData[i].randomDelay)/40 * vertexData[i].dy);
    }
    pos.needsUpdate = true;

    // Hover raycasting
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(plane);

    const colors = plane.geometry.attributes.color;
    for (let i = 0; i < colors.count; i++) {
        // Smoothly fade back to base color
        colors.setX(i, colors.getX(i) + (baseColorRGB.r / 255 - colors.getX(i)) * 0.05);
        colors.setY(i, colors.getY(i) + (baseColorRGB.g / 255 - colors.getY(i)) * 0.05);
        colors.setZ(i, colors.getZ(i) + (baseColorRGB.b / 255 - colors.getZ(i)) * 0.05);
    }

    if (intersects.length) {
        // Highlight hovered face
        const face = intersects[0].face;
        const idxA = face.a;
        const idxB = face.b;
        const idxC = face.c;
        const highlight = new THREE.Color(0x006ea0);
        colors.setXYZ(idxA, highlight.r, highlight.g, highlight.b);
        colors.setXYZ(idxB, highlight.r, highlight.g, highlight.b);
        colors.setXYZ(idxC, highlight.r, highlight.g, highlight.b);
    }
    colors.needsUpdate = true;

    // Rotate stars
    farthestStars.rotation.y -= 0.00001;
    farStars.rotation.y -= 0.00005;
    nearStars.rotation.y -= 0.00011;

    renderer.render(scene, camera);
}

// ---------------------
// Events
// ---------------------
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// ---------------------
// GSAP Buttons
// ---------------------
function setupButtons() {
    const introContainer = $(".ocean-gradient-container");
    const skyContainer = $(".sky-container");
    const xMark = $(".x-mark");

    $(".shift-camera-button").on("click", function () {
        const tl = gsap.timeline();

        tl.to(introContainer, { duration: 0.5, opacity: 0, ease: "power3.in" })
          .to(camera.rotation, { duration: 3, x: Math.PI / 2, ease: "power3.inOut" }, 0)
          .to(camera.position, { duration: 2.5, z: 20, ease: "power3.inOut" }, 0)
          .to(camera.position, { duration: 3, y: 120, ease: "power3.inOut" }, 0)
          .to(plane.scale, { duration: 3, x: 2, ease: "power3.inOut" }, 0)
          .to(xMark, { duration: 2, opacity: 1, ease: "power3.inOut" })
          .to(skyContainer, { duration: 2, opacity: 1, ease: "power3.inOut" }, "<");
    });

    xMark.on("click", function () {
        const tl = gsap.timeline();

        tl.to(xMark, { duration: 0.5, opacity: 0, ease: "power3.inOut" })
          .to(skyContainer, { duration: 0.5, opacity: 0, ease: "power3.inOut" }, "<")
          .to(camera.rotation, { duration: 3, x: 0, ease: "power3.inOut" })
          .to(camera.position, { duration: 3, z: 50, ease: "power3.inOut" }, "<")
          .to(camera.position, { duration: 2.5, y: 0, ease: "power3.inOut" }, "<")
          .to(plane.scale, { duration: 3, x: 1, ease: "power3.inOut" }, "<")
          .to(introContainer, { duration: 0.5, opacity: 1, ease: "power3.in" });
    });
}
