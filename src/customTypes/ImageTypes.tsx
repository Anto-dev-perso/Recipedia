export enum enumForImgPick {
    camera = "camera",
    gallery = "gallery"
}

export type localImgData = {
    uri: string,
    width: number,
    height: number
}

export type Layout = {
    width: number,
    height: number,
}

export type panType = {
    x: number,
    y: number,
}

export type cropData = {
    rectSize: Layout,
    pan: panType,

    rectSizeSetter: React.Dispatch<React.SetStateAction<Layout>>,
    panSetter: React.Dispatch<React.SetStateAction<panType>>,
}
