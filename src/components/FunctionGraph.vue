<template>
    <canvas ref="canvas" class="function-graph"> </canvas>
</template>

<script setup lang="ts">
import { createFunctionGeometry } from "@/lib/3d/function-geometry";
import type { ExpressionNode } from "@/lib/expression/node";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { computed, markRaw, shallowRef, useTemplateRef, watch, watchEffect } from "vue";

const { func } = defineProps<{
    func: ExpressionNode;
}>();

const scene = new THREE.Scene();

const canvas = useTemplateRef("canvas");
const camera = shallowRef<THREE.PerspectiveCamera>();
const renderer = shallowRef<THREE.WebGLRenderer>();
const controls = shallowRef<OrbitControls>();

const geometry = computed(() => {
    return markRaw(createFunctionGeometry(func, { xMin: -3, xMax: 3, yMin: -3, yMax: 3 }));
});

const material = new THREE.MeshPhongMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    shininess: 75,
});
const mesh = new THREE.Mesh(undefined, material);
scene.add(mesh);
scene.add(new THREE.AxesHelper());

const hemisphereLight = new THREE.HemisphereLight("#ffffff", "#7f7f7f", 1.0);
hemisphereLight.position.set(0, 0, 1);
scene.add(hemisphereLight);

const cameraLight = new THREE.DirectionalLight("#ffffff", 1.5);
cameraLight.target.position.set(0, 0, 0);
scene.add(cameraLight);
scene.add(cameraLight.target);

watchEffect(() => {
    mesh.geometry = geometry.value;
    render();
});

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
        camera.value.position.y = 5;
        cameraLight.position.y = 5;
        camera.value.lookAt(new THREE.Vector3(0, 0, 0));
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
        controls.value.maxDistance = 20;
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
