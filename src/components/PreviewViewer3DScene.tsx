import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { TrackballControls, useGLTF, Environment, Html, Center, Bounds } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { Plus, Minus } from 'lucide-react'
import { strings } from '#/lib/strings'

function GltfModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  )
}

function StlModel({ url }: { url: string }) {
  const geo = useLoader(STLLoader, url)
  return (
    <Center>
      <mesh geometry={geo}>
        <meshStandardMaterial color="#7c90b0" roughness={0.35} metalness={0.2} />
      </mesh>
    </Center>
  )
}

function LoadingIndicator() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-[var(--sea-ink-soft)]">
        <div className="h-8 w-8 animate-spin rounded-md border-2 border-[var(--lagoon)] border-t-transparent" />
        <span className="whitespace-nowrap text-xs font-medium">{strings.preview.loadingModel}</span>
      </div>
    </Html>
  )
}

type CameraActions = {
  zoomIn: () => void
  zoomOut: () => void
  frontView: () => void
  backView: () => void
  leftView: () => void
  rightView: () => void
}

function CameraController({ actionsRef }: { actionsRef: React.MutableRefObject<CameraActions | null> }) {
  const { camera, controls } = useThree()

  useEffect(() => {
    function snapTo(x: number, y: number, z: number) {
      const dist = camera.position.length() || 5
      camera.position.set(x * dist, y * dist, z * dist)
      camera.up.set(0, 1, 0)
      camera.lookAt(0, 0, 0)
      const ctrl = controls as any
      if (ctrl) {
        ctrl.target?.set(0, 0, 0)
        ctrl.update?.()
      }
    }

    actionsRef.current = {
      zoomIn: () => { camera.position.multiplyScalar(0.8) },
      zoomOut: () => { camera.position.multiplyScalar(1.25) },
      frontView: () => snapTo(0, 0, 1),
      backView: () => snapTo(0, 0, -1),
      leftView: () => snapTo(-1, 0, 0),
      rightView: () => snapTo(1, 0, 0),
    }
  }, [camera, controls, actionsRef])

  return null
}

export default function PreviewViewer3DScene({
  url,
  fileExt,
}: {
  url: string
  fileExt: 'glb' | 'gltf' | 'stl'
}) {
  const actionsRef = useRef<CameraActions | null>(null)

  const btnClass =
    'flex h-8 items-center justify-center rounded-lg bg-white/80 text-[var(--sea-ink)] shadow backdrop-blur-sm transition hover:bg-white dark:bg-black/50 dark:text-white dark:hover:bg-black/70'

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.0} />
        <directionalLight position={[-4, 2, -3]} intensity={0.5} />
        <directionalLight position={[0, -5, 0]} intensity={0.3} />
        <Environment preset="studio" />
        <Suspense fallback={<LoadingIndicator />}>
          <Bounds fit clip observe margin={1.5}>
            <Center>
              {fileExt === 'stl' ? <StlModel url={url} /> : <GltfModel url={url} />}
            </Center>
          </Bounds>
        </Suspense>
        <TrackballControls
          makeDefault
          rotateSpeed={3}
          zoomSpeed={1.2}
          noPan
          dynamicDampingFactor={0.25}
        />
        <CameraController actionsRef={actionsRef} />
      </Canvas>

      {/* Zoom buttons — bottom right */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
        <button
          onClick={() => actionsRef.current?.zoomIn()}
          aria-label={strings.preview.zoomIn}
          className={`${btnClass} w-8`}
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          onClick={() => actionsRef.current?.zoomOut()}
          aria-label={strings.preview.zoomOut}
          className={`${btnClass} w-8`}
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      {/* View preset buttons — bottom left */}
      <div className="absolute bottom-3 left-3 flex gap-1.5">
        <button
          onClick={() => actionsRef.current?.frontView()}
          aria-label={strings.preview.frontView}
          className={`${btnClass} px-3 text-xs font-medium`}
        >
          {strings.preview.frontView}
        </button>
        <button
          onClick={() => actionsRef.current?.backView()}
          aria-label={strings.preview.backView}
          className={`${btnClass} px-3 text-xs font-medium`}
        >
          {strings.preview.backView}
        </button>
        <button
          onClick={() => actionsRef.current?.leftView()}
          aria-label={strings.preview.leftView}
          className={`${btnClass} px-3 text-xs font-medium`}
        >
          {strings.preview.leftView}
        </button>
        <button
          onClick={() => actionsRef.current?.rightView()}
          aria-label={strings.preview.rightView}
          className={`${btnClass} px-3 text-xs font-medium`}
        >
          {strings.preview.rightView}
        </button>
      </div>
    </div>
  )
}
