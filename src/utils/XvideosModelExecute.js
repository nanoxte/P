import xvideos from 'xvideosx';

export async function getVideosFromXvideox() {
    const fresh = await xvideos.videos.fresh({page: 1})
    return fresh.videos
}

export async function getVideoInformationFromXvideox(url) {
    const detail = await xvideos.videos.details({ url })
    return detail
}

export async function getTheBestVideosFromXvideox() {
    const bestList = await xvideos.videos.best({ year: '2024', month: '02', page: 1 });

    return bestList?.videos
}

//getVideosFromXvideox().then(data => console.log(data))