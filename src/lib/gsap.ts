import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isBrowser } from './utils'

if (isBrowser) gsap.registerPlugin(ScrollTrigger)

gsap.defaults({ ease: 'expo.out', duration: 0.9 })

export { gsap, ScrollTrigger }
