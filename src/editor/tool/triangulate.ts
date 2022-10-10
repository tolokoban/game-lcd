export interface PolygonPoint {
    x: number
    y: number
}

export type Triangle = [number, number, number]

export function triangulate(polygon: PolygonPoint[]): Triangle[] {
    if (polygon.length < 3) return []
    if (polygon.length === 3) return [[0, 1, 2]]
    const triangles: Triangle[] = []
    recursiveTriangulation(
        polygon,
        polygon.map((_item, index) => index),
        triangles
    )
    return triangles
}

function recursiveTriangulation(
    polygon: PolygonPoint[],
    elements: number[],
    triangles: Triangle[]
) {
    while (elements.length > 3) {
        const positiveIndexes: number[] = []
        const negativeIndexes: number[] = []
        for (let index = 0; index < elements.length; index++) {
            const orientation = computeOrientation(polygon, elements, index)
            if (orientation > 0) {
                positiveIndexes.push(index)
            } else {
                negativeIndexes.push(index)
            }
        }
        const bestIndexes =
            positiveIndexes.length > negativeIndexes.length
                ? positiveIndexes
                : negativeIndexes
        let [bestIndex] = bestIndexes
        for (const index of bestIndexes) {
            if (isEmptyTriangle(polygon, elements, index)) {
                bestIndex = index
                break
            }
        }
        triangles.push([
            elements[bestIndex],
            elements[(bestIndex + 1) % elements.length],
            elements[(bestIndex + elements.length - 1) % elements.length],
        ])
        elements.splice(bestIndex, 1)
    }
    triangles.push(elements as Triangle)
}

function computeOrientation(
    polygon: PolygonPoint[],
    elements: number[],
    index: number
) {
    const A = (index + elements.length - 1) % elements.length
    const O = index
    const B = (index + 1) % elements.length
    const xO = polygon[elements[O]].x
    const yO = polygon[elements[O]].y
    const xA = polygon[elements[A]].x - xO
    const yA = polygon[elements[A]].y - yO
    const xB = polygon[elements[B]].x - xO
    const yB = polygon[elements[B]].y - yO
    return xA * yB - yA * xB
}

function isEmptyTriangle(
    polygon: PolygonPoint[],
    elements: number[],
    index: number
) {
    const A = (index + elements.length - 1) % elements.length
    const O = index
    const B = (index + 1) % elements.length
    const xA = polygon[elements[A]].x
    const yA = polygon[elements[A]].y
    const xO = polygon[elements[O]].x
    const yO = polygon[elements[O]].y
    const xB = polygon[elements[B]].x
    const yB = polygon[elements[B]].y
    for (let k = 0; k < elements.length; k++) {
        if (k === A || k === O || k === B) continue

        const x = polygon[k].x
        const y = polygon[k].y
        const pos =
            crossSegment(x, y, xA, yA, xO, yO) +
            crossSegment(x, y, xO, yO, xB, yB) +
            crossSegment(x, y, xB, yB, xA, yA)
        if (pos !== 0) return false
    }
    return true
}

function crossSegment(
    x: number,
    y: number,
    xA: number,
    yA: number,
    xB: number,
    yB: number
) {
    if (y < Math.min(yA, yB)) return 0
    if (y > Math.max(yA, yB)) return 0
    const x1 = x - xA
    const y1 = y - yA
    const x2 = xB - xA
    const y2 = yB - yA
    return x1 * y2 - y1 * x2 > 0 ? +1 : -1
}
