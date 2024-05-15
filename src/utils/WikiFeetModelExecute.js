import { load } from "cheerio"
import fs from 'node:fs'

export async function fetchFeetModel(model) {
    console.log('https://www.wikifeet.com/search/' + transformString(model))
    const response = await fetch('https://www.wikifeet.com/search/' + transformString(model))
    console.log(response.status)
    const html = await response.text()

    // fs.writeFile('f.html', html, {}, () => {

    // })
    const $ = load(html)
    const container = $('.celebbox')

    
    const res = container.map(async (i, el) => {
        const url = $(el).find('a').attr('href')
        const name =  $(el).find('a').last().text()
        const counter = $(el).find('small').text()

        return {
            url: 'https://www.wikifeet.com' + url,
            name,
            counter: String(counter).replace(/[^\d.]/g, '')
        }
    }).get()
    return res[0]

}

// export async function getModelInfo(url) {
//         const response = await fetch(url);
//         const html = await response.text();
//         const $ = load(html);

//         // Usando map para processar os elementos e coletar os URLs desejados
//         const images = $('td').map((i, el) => {
//             const href = $(el).find('a').attr('href');
//             console.log($(el).find('a').text())
//             return href
//         }).get();

//         return {
//             images: images // Filtra os resultados para remover valores nulos ou indefinidos
//         };
// }

export function transformString(string) {
    const words = string.split(" ")
    const wordsAll = words.map(w => {
        return w[0].toUpperCase() + w.slice(1).toLowerCase()
    })

    const res = wordsAll.join('%20')

    return res
}

export function transformStringM(string) {
    const words = string.split(" ")
    const wordsAll = words.map(w => {
        return w[0].toUpperCase() + w.slice(1).toLowerCase()
    })

    const res = wordsAll.join('_')

    return res
}

export function getImage(style) {
    if(style && style.includes('background-image')) {
        const regex = /url\(['"]?(.*?)['"]?\)/
        const matches = regex.exec(style)

        return matches[1]
    }
}

// getModelInfo('https://www.wikifeet.com/Vitória_Castro').then(data => console.log(data))
