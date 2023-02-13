export const cdnUri = (key: string, transform?: string) => {
    return `https://ik.imagekit.io/nginr/virticle-models/${key}${transform ? '?' + transform : ''}`
}
