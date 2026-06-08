import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Html, Center } from '@react-three/drei'
import { Suspense } from 'react'
import { Plus, Minus } from 'lucide-react'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  )
}

function LoadingIndicator() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-[var(--sea-ink-soft)]">
        <div className="h-8 w-8 animate-spin rounded-md border-2 border-[var(--lagoon)] border-t-transparent" />
        <span className="whitespace-nowrap text-xs font-medium">Loading model…</span>
      </div>
    </Html>
  )
}

export default function ProductViewer3DScene({ modelUrl }: { modelUrl: string }) {
  const orbitRef = useRef<{ dollyIn: (s: number) => void; dollyOut: (s: number) => void; update: () => void } | null>(null)

  function handleZoomIn() {
    orbitRef.current?.dollyIn(1.3)
    orbitRef.current?.update()
  }

  function handleZoomOut() {
    orbitRef.current?.dollyOut(1.3)
    orbitRef.current?.update()
  }

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        gl={{ antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <directionalLight position={[-4, 2, -3]} intensity={0.4} />
        <Environment preset="city" />
        <Suspense fallback={<LoadingIndicator />}>
          <Model url={modelUrl} />
        </Suspense>
        <OrbitControls
          ref={orbitRef as never}
          autoRotate
          autoRotateSpeed={1.4}
          enableZoom
          enablePan={false}
          minDistance={1.5}
          maxDistance={8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI * 0.82}
        />
      </Canvas>

      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          aria-label="Zoom in"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-[var(--sea-ink)] shadow backdrop-blur-sm transition hover:bg-white dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          onClick={handleZoomOut}
          aria-label="Zoom out"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-[var(--sea-ink)] shadow backdrop-blur-sm transition hover:bg-white dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
