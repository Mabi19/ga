<template>
    <canvas ref="canvas" class="function-graph"></canvas>
</template>

<script setup lang="ts">
import { createFunctionGeometry } from "@/lib/3d/function-geometry";
import type { FunctionDomain } from "@/lib/expression/domain";
import type { ExpressionNode } from "@/lib/expression/node";
import * as State from "@/state";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { computed, markRaw, shallowRef, useTemplateRef, watch, watchEffect } from "vue";

const {
    func,
    domain,
    markers = false,
} = defineProps<{
    func: ExpressionNode;
    domain: FunctionDomain;
    markers?: boolean;
}>();

const scene = new THREE.Scene();

const canvas = useTemplateRef("canvas");
const camera = shallowRef<THREE.PerspectiveCamera>();
const renderer = shallowRef<THREE.WebGLRenderer>();
const controls = shallowRef<OrbitControls>();

const orbitPoint = computed(
    () => new THREE.Vector3((domain.xMin + domain.xMax) / 2, (domain.yMin + domain.yMax) / 2, 0),
);
watch(orbitPoint, () => {
    if (camera.value && controls.value) {
        camera.value.lookAt(orbitPoint.value);
        controls.value.target = orbitPoint.value;
        controls.value.update();
    }
});

const geometry = computed(() => {
    return markRaw(createFunctionGeometry(func, domain));
});

const material = new THREE.MeshPhongMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    shininess: 75,
});
const mesh = new THREE.Mesh(undefined, material);
scene.add(mesh);

watchEffect(() => {
    mesh.geometry = geometry.value;
    render();
});

const markerGeometry = new THREE.SphereGeometry(0.1);
const markerMaterial = new THREE.MeshLambertMaterial();
const markersMesh = new THREE.InstancedMesh(markerGeometry, markerMaterial, State.MAX_POPULATION);
const markerColorInactive = new THREE.Color("#22bb22");
const markerColorActive = new THREE.Color("#eecc00");
watchEffect(() => {
    markersMesh.visible = markers;
    if (markers) {
        markersMesh.count = State.population.value.length;
        for (let i = 0; i < State.population.value.length; i++) {
            const chromosome = State.population.value[i]!;
            const mat = new THREE.Matrix4();
            mat.setPosition(
                new THREE.Vector3(
                    chromosome.x,
                    chromosome.y,
                    State.targetFunction.value.eval(chromosome.x, chromosome.y),
                ),
            );
            markersMesh.setMatrixAt(i, mat);

            if (chromosome.id == State.highlightID.value) {
                markersMesh.setColorAt(i, markerColorActive);
            } else {
                markersMesh.setColorAt(i, markerColorInactive);
            }
        }
        markersMesh.instanceMatrix.needsUpdate = true;
        markersMesh.instanceColor!.needsUpdate = true;
    }
    render();
});
scene.add(markersMesh);

scene.add(new THREE.AxesHelper());

const hemisphereLight = new THREE.HemisphereLight("#ffffff", "#7f7f7f", 1.0);
hemisphereLight.position.set(0, 0, 1);
scene.add(hemisphereLight);

const cameraLight = new THREE.DirectionalLight("#ffffff", 1.5);
cameraLight.target.position.set(0, 0, 0);
scene.add(cameraLight);
scene.add(cameraLight.target);

function render() {
    if (!renderer.value || !camera.value) {
        return;
    }
    const r = renderer.value;
    const cam = camera.value;
    r.render(scene, cam);
}

watch(canvas, () => {
    if (canvas.value) {
        camera.value = new THREE.PerspectiveCamera(
            75,
            canvas.value.clientWidth / canvas.value.clientHeight,
            0.1,
            100,
        );
        camera.value.up.set(0, 0, 1);
        camera.value.position.y = orbitPoint.value.y - 3;
        camera.value.position.z = orbitPoint.value.z + 4;
        cameraLight.position.y = orbitPoint.value.y - 3;
        cameraLight.position.z = orbitPoint.value.z + 4;
        camera.value.lookAt(orbitPoint.value);
        renderer.value = new THREE.WebGLRenderer({
            canvas: canvas.value,
            alpha: true,
            premultipliedAlpha: false,
        });
        renderer.value.setSize(
            canvas.value.clientWidth * devicePixelRatio,
            canvas.value.clientHeight * devicePixelRatio,
            false,
        );

        controls.value = new OrbitControls(camera.value, canvas.value);
        controls.value.minDistance = 1.5;
        controls.value.maxDistance = 20;
        controls.value.target = orbitPoint.value;
        controls.value.update();
        controls.value.addEventListener("change", () => {
            cameraLight.position.copy(camera.value!.position);
            render();
        });

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.contentBoxSize) {
                    const width = entry.contentBoxSize[0]!.inlineSize;
                    const height = entry.contentBoxSize[0]!.blockSize;
                    if (camera.value) {
                        camera.value.aspect = width / height;
                        camera.value.updateProjectionMatrix();
                    }
                    renderer.value?.setSize(
                        width * devicePixelRatio,
                        height * devicePixelRatio,
                        false,
                    );
                    render();
                }
            }
        });
        resizeObserver.observe(canvas.value);
    }
});
</script>

<style scoped>
.function-graph {
    display: block;
}
</style>
