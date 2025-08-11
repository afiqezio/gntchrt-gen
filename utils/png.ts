export async function downloadElementAsPng(el: HTMLElement, filename = 'export.png') {
  const svgNS = 'http://www.w3.org/2000/svg'
  const xhtmlNS = 'http://www.w3.org/1999/xhtml'

  // Use scroll size to capture full content, not just visible box
  const width = Math.ceil(el.scrollWidth || el.getBoundingClientRect().width)
  const height = Math.ceil(el.scrollHeight || el.getBoundingClientRect().height)

  const xml = new XMLSerializer()
  const clone = el.cloneNode(true) as HTMLElement
  inlineStyles(clone)

  // Ensure clone has the same dimensions
  clone.style.width = width + 'px'
  clone.style.height = height + 'px'

  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('xmlns', svgNS)
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(height))

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

  const data = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml.serializeToString(svg))
  const img = new Image()
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = reject
    img.src = data
  })

  // Improve quality on HiDPI
  const scale = Math.min(2, window.devicePixelRatio || 1)
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(width * scale)
  canvas.height = Math.ceil(height * scale)
  const ctx = canvas.getContext('2d')!

  // Background fill (fallback to body background or white)
  const bg = getComputedStyle(document.body).backgroundColor || '#ffffff'
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.setTransform(scale, 0, 0, scale, 0, 0)
  ctx.drawImage(img, 0, 0)

  const blob = await new Promise<Blob | null>(r => canvas.toBlob(r))
  if (!blob) return
  const a = document.createElement('a')
  const url = URL.createObjectURL(blob)
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
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


