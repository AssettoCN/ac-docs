import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import type { Theme } from 'vitepress'
import './index.css'

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute()

    const initZoom = () => {
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
    }

    onMounted(() => {
      initZoom()
    })

    watch(
      () => route.path,
      () => nextTick(() => initZoom()),
    )
  },
} satisfies Theme
