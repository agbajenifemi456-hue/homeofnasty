'use client'

import { useEffect, useRef } from 'react'

export function AdBanner({ width, height, adKey, adSrc }: { width: number, height: number, adKey: string, adSrc: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear out anything React might have put there
    containerRef.current.innerHTML = ''

    // 1. Create the atOptions script
    const optionsScript = document.createElement('script')
    optionsScript.type = 'text/javascript'
    optionsScript.innerHTML = `
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `
    containerRef.current.appendChild(optionsScript)

    // 2. Create the src script
    const srcScript = document.createElement('script')
    srcScript.type = 'text/javascript'
    srcScript.src = adSrc
    containerRef.current.appendChild(srcScript)

    return () => {
      // Cleanup when component unmounts
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [width, height, adKey, adSrc])

  return (
    <div 
      ref={containerRef} 
      style={{ width: `${width}px`, height: `${height}px`, overflow: 'hidden', margin: '0 auto' }} 
    />
  )
}