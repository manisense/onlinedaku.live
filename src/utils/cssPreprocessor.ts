import postcss from 'postcss';
import nested from 'postcss-nested';

export async function preprocessCss(css: string): Promise<string> {
  try {
    const result = await postcss([nested]).process(css, { from: undefined });
    return result.css;
  } catch (error) {
    console.log('Error preprocessing CSS:', error)
    return css.replace(/>/g, '');
  }
}

export function cleanStyleContent(styleContent: string): string {
  // Remove problematic nested selectors if preprocessing fails
  return styleContent.replace(/>\s*\./g, '.')
                    .replace(/>\s*[^{]+{/g, '')
                    .replace(/\s+/g, ' ')
                    .trim();
}
