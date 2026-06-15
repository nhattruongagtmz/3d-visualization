import { useState, useEffect, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { UploadCloud } from 'lucide-react'
import { useGLTF } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { Button } from '../components/ui/button'
import { cn } from '../lib/utils'
import { strings } from '../lib/strings'
import PreviewViewer3D from '../components/PreviewViewer3D'

export const Route = createFileRoute('/preview')({
  component: PreviewPage,
})

type FileExt = 'glb' | 'gltf' | 'stl'
interface FileState {
  file: File
  objectUrl: string
  ext: FileExt
}

function PreviewPage() {
  const [fileState, setFileState] = useState<FileState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const prev = fileState
    return () => {
      if (!prev) return
      if (prev.ext === 'stl') {
        useLoader.clear(STLLoader, prev.objectUrl)
      } else {
        useGLTF.clear(prev.objectUrl)
      }
      URL.revokeObjectURL(prev.objectUrl)
    }
  }, [fileState])

  function validateAndLoad(file: File) {
    setError(null)
    const name = file.name.toLowerCase()
    const ext: FileExt | null = name.endsWith('.glb')
      ? 'glb'
      : name.endsWith('.gltf')
        ? 'gltf'
        : name.endsWith('.stl')
          ? 'stl'
          : null

    if (!ext) {
      setError(strings.preview.errorInvalidType)
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setError(strings.preview.errorFileTooLarge)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setFileState({ file, objectUrl, ext })
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) validateAndLoad(file)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) validateAndLoad(file)
    e.target.value = ''
  }

  function handleReset() {
    setFileState(null)
    setError(null)
  }

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8 mb-8">
        <p className="island-kicker mb-2">Preview</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          {strings.preview.pageTitle}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--sea-ink-soft)]">
          {strings.preview.pageSubtitle}
        </p>
      </section>

      {fileState === null ? (
        <DropZone
          isDragging={isDragging}
          error={error}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileInput={handleFileInput}
        />
      ) : (
        <ViewerSection fileState={fileState} onReset={handleReset} />
      )}
    </main>
  )
}

function DropZone({
  isDragging,
  error,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInput,
}: {
  isDragging: boolean
  error: string | null
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-16 text-center transition-colors',
        isDragging
          ? 'border-[var(--lagoon)] bg-[var(--lagoon)]/5'
          : error
            ? 'border-destructive bg-[var(--surface)]'
            : 'border-[var(--line)] bg-[var(--surface)]',
      )}
    >
      <UploadCloud
        className={cn(
          'mb-4 h-12 w-12 transition-colors',
          isDragging ? 'text-[var(--lagoon)]' : 'text-[var(--sea-ink-soft)]',
        )}
      />

      <p className="mb-1 text-lg font-semibold text-[var(--sea-ink)]">
        {isDragging ? strings.preview.dropzoneDragging : strings.preview.dropzoneIdle}
      </p>

      <p className="mb-4 text-sm text-[var(--sea-ink-soft)]">{strings.preview.dropzoneOr}</p>

      <Button variant="outline" onClick={() => inputRef.current?.click()}>
        {strings.preview.dropzoneBrowse}
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept=".glb,.gltf,.stl"
        className="hidden"
        onChange={onFileInput}
      />

      <div className="mt-6 flex items-center gap-2">
        {['GLB', 'GLTF', 'STL'].map((fmt) => (
          <span
            key={fmt}
            className="rounded-full border border-[var(--line)] bg-[var(--chip-bg,var(--surface))] px-2.5 py-0.5 text-xs text-[var(--sea-ink-soft)]"
          >
            {fmt}
          </span>
        ))}
      </div>

      <p className="mt-2 text-xs text-[var(--sea-ink-soft)]">{strings.preview.dropzoneSizeLimit}</p>

      {error && (
        <p className="mt-4 text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  )
}

function ViewerSection({
  fileState,
  onReset,
}: {
  fileState: FileState
  onReset: () => void
}) {
  const sizeKb = fileState.file.size / 1024

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--sea-ink)]">
            {strings.preview.fileName(fileState.file.name)}
          </p>
          <p className="text-xs text-[var(--sea-ink-soft)]">
            {strings.preview.fileSize(sizeKb)}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onReset}>
          <UploadCloud className="mr-2 h-4 w-4" />
          {strings.preview.uploadAnother}
        </Button>
      </div>

      <PreviewViewer3D url={fileState.objectUrl} fileExt={fileState.ext} />
    </div>
  )
}
