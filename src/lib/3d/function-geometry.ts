import type { ExpressionNode } from "@/lib/expression/node";
import type { BufferGeometry } from "three";
import * as THREE from "three";
import { OklabColor } from "../oklab";

interface FunctionDomain {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
}

const COLOR_HIGH = new OklabColor(0.5, 0.15, 0.07);
const COLOR_LOW = new OklabColor(0.5, -0.05, -0.1);

export function createFunctionGeometry(
    func: ExpressionNode,
    { xMin, xMax, yMin, yMax }: FunctionDomain,
): BufferGeometry {
    const geom = new THREE.BufferGeometry();

    const RESOLUTION = 32;
    const positions = new Float32Array(3 * RESOLUTION * RESOLUTION);

    const xStep = (xMax - xMin) / (RESOLUTION - 1);
    const yStep = (yMax - yMin) / (RESOLUTION - 1);
    // used for colors
    let minZ = +Infinity;
    let maxZ = -Infinity;
    for (let xi = 0; xi < RESOLUTION; xi++) {
        for (let yi = 0; yi < RESOLUTION; yi++) {
            const x = xMin + xi * xStep;
            const y = yMin + yi * yStep;
            positions[3 * (xi * RESOLUTION + yi) + 0] = x;
            positions[3 * (xi * RESOLUTION + yi) + 1] = y;
            const value = func.eval(x, y);
            minZ = Math.min(minZ, value);
            maxZ = Math.max(maxZ, value);
            positions[3 * (xi * RESOLUTION + yi) + 2] = value;
        }
    }

    const colors = new Float32Array(3 * RESOLUTION * RESOLUTION);
    for (let xi = 0; xi < RESOLUTION; xi++) {
        for (let yi = 0; yi < RESOLUTION; yi++) {
            const value = positions[3 * (xi * RESOLUTION + yi) + 2]!;
            const color = OklabColor.lerp(
                COLOR_LOW,
                COLOR_HIGH,
                minZ == maxZ ? 0.5 : (value - minZ) / (maxZ - minZ),
            ).toRGB();
            colors[3 * (xi * RESOLUTION + yi) + 0] = color[0];
            colors[3 * (xi * RESOLUTION + yi) + 1] = color[1];
            colors[3 * (xi * RESOLUTION + yi) + 2] = color[2];
        }
    }

    const vertIndices: number[] = [];
    for (let xi = 0; xi < RESOLUTION - 1; xi++) {
        for (let yi = 0; yi < RESOLUTION - 1; yi++) {
            if (
                isFinite(positions[3 * (xi * RESOLUTION + yi) + 2]!) &&
                isFinite(positions[3 * ((xi + 1) * RESOLUTION + yi) + 2]!) &&
                isFinite(positions[3 * (xi * RESOLUTION + (yi + 1)) + 2]!)
            ) {
                vertIndices.push(
                    xi * RESOLUTION + yi,
                    (xi + 1) * RESOLUTION + yi,
                    xi * RESOLUTION + (yi + 1),
                );
            }
            if (
                isFinite(positions[3 * ((xi + 1) * RESOLUTION + yi) + 2]!) &&
                isFinite(positions[3 * ((xi + 1) * RESOLUTION + (yi + 1)) + 2]!) &&
                isFinite(positions[3 * (xi * RESOLUTION + (yi + 1)) + 2]!)
            ) {
                vertIndices.push(
                    (xi + 1) * RESOLUTION + yi,
                    (xi + 1) * RESOLUTION + (yi + 1),
                    xi * RESOLUTION + (yi + 1),
                );
            }
        }
    }

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geom.setIndex(vertIndices);
    geom.computeVertexNormals();

    return geom;
}
