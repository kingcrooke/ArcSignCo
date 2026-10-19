import { slideAssetUrl } from './publishedSlides'

export async function fetchFullSlideBlob(basename: string): Promise<Blob> {
  const jpg = slideAssetUrl(basename, 'full', 'jpg')
  const res = await fetch(jpg)
  if (!res.ok) throw new Error('Could not load full slide')
  return res.blob()
}

export async function shareOrDownloadSlide(
  basename: string,
  title: string,
): Promise<'shared' | 'downloaded' | 'error'> {
  try {
    const blob = await fetchFullSlideBlob(basename)
    const file = new File([blob], `${basename}.jpg`, {
      type: blob.type || 'image/jpeg',
    })
    const canShare =
      typeof navigator.share === 'function' &&
      (!navigator.canShare || navigator.canShare({ files: [file] }))

    if (canShare) {
      await navigator.share({ files: [file], title })
      return 'shared'
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${basename}.jpg`
    a.click()
    URL.revokeObjectURL(url)
    return 'downloaded'
  } catch {
    return 'error'
  }
}
