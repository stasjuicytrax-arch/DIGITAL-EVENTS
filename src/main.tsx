import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import { initChunkReload } from './lib/chunk-reload'
import './styles/globals.css'

// после нового деплоя старые чанки пропадают — одна перезагрузка вместо падения (src/lib/chunk-reload.ts)
if (typeof window !== 'undefined') initChunkReload()

export const createRoot = ViteReactSSG({ routes, basename: import.meta.env.BASE_URL })
