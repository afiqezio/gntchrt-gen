export async function downloadElementAsPng(el: HTMLElement, filename = 'gantt.png') {
  if (typeof window === 'undefined' || !el) return

  const width = Math.ceil(el.scrollWidth || el.getBoundingClientRect().width)
  const height = Math.ceil(el.scrollHeight || el.getBoundingClientRect().height)
  const pixelRatio = Math.min(2, window.devicePixelRatio || 1)
  const bg = getComputedStyle(document.body).backgroundColor || '#ffffff'

  try {
    // Prefer robust DOM rasterization with full-size capture
    const { toBlob } = await import('html-to-image')
    const blob = await toBlob(el, {
      backgroundColor: bg,
      pixelRatio,
      width,
      height,
      style: {
        width: width + 'px',
        height: height + 'px',
      },
      cacheBust: true,
    })
    if (blob) {
      triggerDownload(blob, filename)
      return
    }
  } catch {
    // fall through to foreignObject fallback
  }

  // Fallback: foreignObject approach (less reliable with some CSS, but works offline)
  const blob = await fallbackForeignObject(el, { width, height, pixelRatio, background: bg })
  if (blob) triggerDownload(blob, filename)
}

function triggerDownload(blob: Blob, filename: string) {
  const a = document.createElement('a')
  const url = URL.createObjectURL(blob)
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

async function fallbackForeignObject(
  el: HTMLElement,
  opts: { width: number; height: number; pixelRatio: number; background: string }
): Promise<Blob | null> {
  const { width, height, pixelRatio, background } = opts
  const svgNS = 'http://www.w3.org/2000/svg'
  const xhtmlNS = 'http://www.w3.org/1999/xhtml'

  const clone = el.cloneNode(true) as HTMLElement
  inlineStyles(clone)

  clone.style.width = width + 'px'
  clone.style.height = height + 'px'

  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('xmlns', svgNS)
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(height))
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

  const fo = document.createElementNS(svgNS, 'foreignObject')
  fo.setAttribute('width', String(width))
  fo.setAttribute('height', String(height))

  const wrapper = document.createElementNS(xhtmlNS, 'div')
  wrapper.setAttribute('xmlns', xhtmlNS)
  wrapper.style.width = width + 'px'
  wrapper.style.height = height + 'px'
  wrapper.appendChild(clone)

  fo.appendChild(wrapper)
  svg.appendChild(fo)

  const xml = new XMLSerializer().serializeToString(svg)
  const data = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml)
  const img = new Image()

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = reject
    img.src = data
  })

  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(width * pixelRatio)
  canvas.height = Math.ceil(height * pixelRatio)
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = background
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  ctx.drawImage(img, 0, 0)

  return await new Promise<Blob | null>(r => canvas.toBlob(r))
}

function inlineStyles(element: HTMLElement) {
  const win = element.ownerDocument.defaultView || window
  const computed = win.getComputedStyle(element)
  for (const name of computed) {
    element.style.setProperty(name, computed.getPropertyValue(name))
  }
  for (const child of Array.from(element.children)) {
    inlineStyles(child as HTMLElement)
  }
}