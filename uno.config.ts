import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['flex-center', 'flex items-center justify-center'],
    ['full', 'w-full h-full'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose m-auto text-left'.split(' '),
})
