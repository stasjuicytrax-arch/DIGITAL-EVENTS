import type { RouteRecord } from 'vite-react-ssg'
import { Layout } from './Layout'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    entry: 'src/Layout.tsx',
    children: [
      { index: true, lazy: () => import('./pages/Home') },
      { path: '*', lazy: () => import('./pages/NotFound') },
    ],
  },
]
