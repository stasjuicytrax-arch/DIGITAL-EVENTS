import type { RouteRecord } from 'vite-react-ssg'
import { Layout } from './Layout'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    entry: 'src/Layout.tsx',
    children: [
      { index: true, lazy: () => import('./pages/Home') },
      { path: 'kit', lazy: () => import('./pages/Kit') },
      { path: '*', lazy: () => import('./pages/NotFound') },
    ],
  },
]
