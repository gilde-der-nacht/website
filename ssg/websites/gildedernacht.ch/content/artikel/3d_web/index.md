---
title: "3D Web"
date: 2021-10-24
---

# 3D Web

<script src="https://cdn.babylonjs.com/babylon.js"></script>
<script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
<script type="module">
async function createSceneAsync(engine) {
	const scene = new BABYLON.Scene(engine);

	const enableReflections = true;

	// Camera

	const cameraTarget = new BABYLON.Vector3(0.0, 0.0, 0.0);
	const camera = new BABYLON.ArcRotateCamera('camera', 2.5, 1.3, 70.0, cameraTarget, scene);
	camera.lowerRadiusLimit = 20;
	camera.attachControl(canvas, true);

	// Lights

	const lightAmbient = new BABYLON.HemisphericLight('light-sun', new BABYLON.Vector3(0.0, 1.0, 0.0), scene);
	lightAmbient.intensity = 0.6;

	const directionSun = new BABYLON.Vector3(0.0, -1.0, -0.0);
	const lightSun = new BABYLON.DirectionalLight('light-ambient', directionSun, scene);
	lightSun.position = new BABYLON.Vector3(0.0, 10.0, 0.0);
	lightSun.intensity = 1.0;

	// Shadows

	const shadow = new BABYLON.ShadowGenerator(2048, lightSun);
	shadow.usePercentageCloserFiltering = true;

	// Material

	const materialWater = new BABYLON.StandardMaterial('water', scene);
	materialWater.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0);
	if (enableReflections) {
		materialWater.specularTexture = new BABYLON.Texture('white.png', scene);
	}

	// Meshes

	const sphereSun = BABYLON.Mesh.CreateSphere('sphere-sun', 8, 5.0, scene);

	const cube = await BABYLON.SceneLoader.ImportMeshAsync('', './', '2021-10-17.glb', scene);
	shadow.addShadowCaster(cube.meshes[0]);
	cube.meshes[0].position.y = 0.1;
	cube.meshes[1].receiveShadows = true;

	const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 200, height: 200 });
	ground.material = materialWater;
	ground.receiveShadows = true;

	// Screen Space Reflections

	if (enableReflections) {
		const ssr = new BABYLON.ScreenSpaceReflectionPostProcess('ssr', scene, 1.0, camera);
		ssr.reflectionSamples = 64;
		ssr.strength = 0.9;
		ssr.reflectionSpecularFalloffExponent = 2;
	}

	// Update

	scene.beforeRender = () => {
		const r = 30.0;
		const angle = new Date().getTime() * 0.001;
		const x = r * Math.cos(angle);
		const z = r * Math.sin(angle);

		const positionLight = new BABYLON.Vector3(x, 50.0, z);
		sphereSun.position = positionLight;
		lightSun.position = positionLight;
		lightSun.setDirectionToTarget(new BABYLON.Vector3(0.0, 0.0, 0.0));
	}

	return scene;
}

async function main() {
	const canvas = document.getElementById('canvas');
	const engine = new BABYLON.Engine(canvas, true);
	const scene = await createSceneAsync(engine);

	engine.runRenderLoop(() => {
		scene.render();
	});

	window.addEventListener('resize', () => {
		engine.resize();
	});
}

window.addEventListener('load', main);
</script>

<style>
#canvas {
	border: 1px solid #000;
	width: 800px;
	height: 600px;
	touch-action: none;
}
</style>

<canvas id="canvas" touch-action="none"></canvas>

- Bibliothek: [BabylonJS](https://www.babylonjs.com/)
- Komplexität: ~5200 Faces, ~11'100 Triangles</li>
- Schatten: 2048 Pixel, [PCF](https://developer.nvidia.com/gpugems/gpugems/part-ii-lighting-and-shadows/chapter-11-shadow-map-antialiasing)
