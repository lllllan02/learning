document.addEventListener("nav", async () => {
  const images = document.querySelectorAll("article img")
  if (images.length > 0) {
    try {
      // @ts-ignore
      const { default: mediumZoom } = await import("https://cdn.jsdelivr.net/npm/medium-zoom@1.1.0/dist/medium-zoom.esm.js")
      mediumZoom(images, {
        background: "var(--light)",
        margin: 24,
      })
    } catch (e) {
      console.error("Failed to load medium-zoom", e)
    }
  }
})
