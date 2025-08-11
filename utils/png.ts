export async function downloadElementAsPng(el: HTMLElement, filename = 'export.png') {
  const svgNS = 'http://www.w3.org/2000/svg'
  const { width, height } = el.getBoundingClientRect()

  const xml = new XMLSerializer()
  const clone = el.cloneNode(true) as HTMLElement
  inlineStyles(clone)

  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('xmlns', svgNS)
  svg.setAttribute('width', String(Math.ceil(width)))
  svg.setAttribute('height', String(Math.ceil(height)))

  const fo = document.createElementNS(svgNS, 'foreignObject')
  fo.setAttribute('width', '100%')
  fo.setAttribute('height', '100%')
  fo.appendChild(clone)
  svg.appendChild(fo)

  const data = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml.serializeToString(svg))
  const img = new Image()
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = reject
    img.src = data
  })

  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(width)
  canvas.height = Math.ceil(height)
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background') || '#0b0f16'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0)

  const blob = await new Promise<Blob | null>(r => canvas.toBlob(r))
  if (!blob) return
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
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


