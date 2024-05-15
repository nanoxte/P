import { load } from "cheerio"
import fs from 'node:fs'
export async function fetchFeetModel(model) {
    console.log('https://www.wikifeet.com/' + transformString(model))
    const response = await fetch('https://www.wikifeet.com/search/' + transformString(model))
    const html = await response.text()

    fs.writeFile('f.html', html, {}, () => {

    })
    const $ = load(html)
    const container = $('.celebbox')

    const images = $('.celebbox').find('.crslimg').map((i, element) => {
        const elc = $(element).attr('style')
        const url = getImage(elc)
        return url
    }).get()
    const res = container.map((i, el) => {
        const url = $(el).find('a').attr('href')
        const name =  $(el).find('a').last().text()
        const counter = $(el).find('small').text()
        


        return {
            url: 'https://www.wikifeet.com' + url,
            name,
            images,
            counter: String(counter).replace(/[^\d.]/g, '')
        }
    }).get()
    return res[0]

}

export function transformString(string) {
    const words = string.split(" ")
    const wordsAll = words.map(w => {
        return w[0].toUpperCase() + w.slice(1).toLowerCase()
    })

    const res = wordsAll.join('%20')

    return res
}

export function getImage(style) {
    if(style && style.includes('background-image')) {
        const regex = /url\(['"]?(.*?)['"]?\)/
        const matches = regex.exec(style)

        return matches[1]
    }
}

getFeetModel('Kat Graham').then(data => console.log(data))