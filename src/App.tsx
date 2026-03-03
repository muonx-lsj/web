/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, MeshTransmissionMaterial, Float, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

const PRETENDARD_EXTRABOLD = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff/Pretendard-ExtraBold.woff";

function Scene() {
  const { viewport } = useThree();
  
  // Responsive calculations based on viewport width
  const titleFontSize = Math.min(Math.max(viewport.width * 0.1, 0.3), 1.5);
  const subtitleFontSize = Math.min(Math.max(viewport.width * 0.04, 0.12), 0.7);
  const paddingX = Math.min(Math.max(viewport.width * 0.08, 0.2), 1.5);
  const maxWidth = Math.max(viewport.width - paddingX * 2, 2);
  
  // Adjust vertical positioning based on screen size
  const titleY = Math.min(Math.max(viewport.height * 0.15, 0.5), 2.5);
  const subtitleY = titleY - titleFontSize * 0.5 - 0.1;

  return (
    <>
      <group position={[-viewport.width / 2 + paddingX, -0.5, -3]}>
        <Text
          position={[0, titleY, 0]}
          fontSize={titleFontSize}
          color="white"
          anchorX="left"
          anchorY="bottom"
          font={PRETENDARD_EXTRABOLD}
          letterSpacing={-0.02}
        >
          MUON X!!
        </Text>
        <Text
          position={[0, subtitleY, 0]}
          fontSize={subtitleFontSize}
          color="#e0e0e0"
          anchorX="left"
          anchorY="top"
          lineHeight={1.3}
          font={PRETENDARD_EXTRABOLD}
          maxWidth={maxWidth}
        >
          THE CONTENT MASTERS: A{'\n'}VETERAN-LED HUB FOR CREATION,{'\n'}DISTRIBUTION, AND STRATEGY.
        </Text>
      </group>

      <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
        <GlassSphere position={[-3, 2, -1]} scale={0.4} />
      </Float>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
        <GlassSphere position={[4, -1, 0]} scale={0.6} />
      </Float>
      <Float speed={1} rotationIntensity={1} floatIntensity={1}>
        <GlassSphere position={[2, 3, -2]} scale={0.25} />
      </Float>
      <Float speed={2.5} rotationIntensity={1} floatIntensity={2}>
        <GlassSphere position={[-4, -2, -1]} scale={0.45} />
      </Float>

      <CursorSphere />
    </>
  );
}

function GlassSphere({ position, scale }: { position: [number, number, number], scale: number }) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshTransmissionMaterial
        backside
        samples={4}
        resolution={512}
        transmission={1}
        roughness={0}
        thickness={1.5}
        ior={1.5}
        chromaticAberration={0.04}
        anisotropy={0.1}
        color="#ffffff"
      />
    </mesh>
  );
}

function CursorSphere() {
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport, pointer } = useThree();
  
  useFrame(() => {
    if (!mesh.current) return;
    const x = (pointer.x * viewport.width) / 2;
    const y = (pointer.y * viewport.height) / 2;
    mesh.current.position.lerp(new THREE.Vector3(x, y, 1.5), 0.1);
  });

  return (
    <mesh ref={mesh} scale={0.5}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshTransmissionMaterial
        backside
        samples={8}
        resolution={1024}
        transmission={1}
        roughness={0}
        thickness={1.5}
        ior={1.5}
        chromaticAberration={0.04}
        anisotropy={0.3}
        color="#ffffff"
      />
    </mesh>
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#050505', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Scene />
        
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <Lightformer intensity={1} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
            <Lightformer intensity={0.5} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
            <Lightformer intensity={0.5} rotation-y={-Math.PI / 2} position={[5, 1, -1]} scale={[10, 2, 1]} />
          </group>
        </Environment>
      </Canvas>
    </div>
  );
}
