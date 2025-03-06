const { XMLParser } = require('fast-xml-parser');
require('dotenv').config()
const fs = require('node:fs');
const { EmbedBuilder, WebhookClient, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const webhookClient = new WebhookClient({ url: `${process.env.WEBHOOK}` });
const FILENAME = process.env.FILENAME;
const parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true,
  });

JSON.parse(process.env.RSS).forEach(async (element) => {
    async function xml(element) {
        try {
            const response = await fetch(element)
            const rangido = parser.parse(await response.text(), "text/xml");
            return rangido
        } catch(e) {
         console.log(e);
        }
       }
    async function checkprice(linksteam) {
        let id = linksteam.split("app/")[1]
        resp = await fetch(`https://store.steampowered.com/api/appdetails?appids=${id}&cc=br&filters=price_overview`)
        if (!resp.ok) throw new Error('Failed to fetch data');
        let xml = JSON.parse(await resp.text())
        let pri = xml[id].data.price_overview.initial.toString(); 
        await new Promise(resolve => setTimeout(resolve, 1));
        if (pri.length === 1) {
            pri = '0' + pri + '0';  // For example: 5 -> R$ 0,05
        } else if (pri.length === 2) {
            pri = '0' + pri;  // For example: 50 -> R$ 0,50
        }
        const integerPart = pri.slice(0, -2);
        const decimalPart = pri.slice(-2);
        return`R$ ${integerPart},${decimalPart}`
    }
    function isblank(text) {
        if (text !== undefined && text !== null && text !== '') {
            return true
        }
        else { return false }
    }
    function date(dateString) {
        const formattedString = dateString.replace(' ', 'T');
        const date = new Date(formattedString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${hours}:${minutes} ${day}/${month}/${year}`;
      }
    const clt = await xml(element)
    const link = clt.feed.entry.link["@_href"]
    const infos = {
        title: "Sem dados",
        plat: "Sem dados",
        price: "Sem dados",
        img: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        categoria: "Sem dados",
        from: "Sem dados",
        to: "Sem dados",
        rating: "Sem dados",
        link: "Sem dados", 
        color: "5865F2",
        icon: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        id: 0
    } 
    if (clt.feed.title.includes("Steam")) {
        infos.plat = "Steam"
        infos.color = "66c0f4"
        infos.price = await checkprice(link)
        infos.icon = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/512px-Steam_icon_logo.svg.png"
        if (isblank(clt.feed.entry.content.div.img["@_src"]) == true) { infos.img = clt.feed.entry.content.div.img["@_src"] }
        if (isblank(clt.feed.entry.content.div.ul.ul.li[3]["#text"]) == true) { infos.categoria = clt.feed.entry.content.div.ul.ul.li[3]["#text"] }
        if (isblank(clt.feed.entry.content.div.ul.ul.li[0].a["#text"].split("Steam ")[1].split("recommendations")[0]+"Recomendações)") == true) { infos.rating = clt.feed.entry.content.div.ul.ul.li[0].a["#text"].split("Steam ")[1].split("recommendations")[0]+"Recomendações)" }
    }
    else if (clt.feed.title.includes("Epic")) {
        infos.plat = "Epic Games"
        infos.color = "FFFFFF"
        infos.icon = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Epic_Games_logo.svg/800px-Epic_Games_logo.svg.png"
        let links = "sem dados"
        clt.feed.entry.content.div.ul.ul.li[0].a.forEach((a) => {
            if (a["@_href"].includes("steampowered")) {
                links = a["@_href"]
                infos.rating = a["#text"].split("Steam ")[1].split("recommendations")[0]+"Recomendações)"
            }
        });
        infos.price = await checkprice(links)
        if (isblank(clt.feed.entry.content.div.ul.ul.li[4]["#text"]) == true) { infos.categoria = clt.feed.entry.content.div.ul.ul.li[4]["#text"] }
    }
    if (isblank(clt.feed.entry.content.div.img["@_src"]) == true) { infos.img = clt.feed.entry.content.div.img["@_src"] }
    if (isblank(clt.feed.entry.content.div.ul.li[0]["#text"]) == true) { infos.from = date(clt.feed.entry.content.div.ul.li[0]["#text"]) }
    if (isblank(clt.feed.entry.content.div.ul.li[1]["#text"]) == true) { infos.to = date(clt.feed.entry.content.div.ul.li[1]["#text"]) }
    if (isblank(clt.feed.entry.title.split(") - ")[1]) == true ) { infos.title = clt.feed.entry.title.split(") - ")[1]} 
    if (isblank(clt.feed.entry.link["@_href"].split("/home")[0] == true )) { infos.link = clt.feed.entry.link["@_href"].split("/home")[0] }
    if (isblank(clt.feed.entry.id.split("https://phenx.de/loot/")[1]) == true ) { infos.id = clt.feed.entry.id.split("https://phenx.de/loot/")[1] }
    //console.log(clt.feed.entry.link["@_href"].split("/home")[0])
    // - FIM DO SETOR DE HANDLING DO XML -

    // - SETOR DE HANDINLG DO TXT PARA EVITAR DUPLICATAS -
    function idExists(id) {
        try {
            if (!fs.existsSync(FILENAME)) return false;
            let data = fs.readFileSync(FILENAME, 'utf8').trim();
            let array = data ? JSON.parse(data) : [];
            return array.includes(id);
        } catch (err) {
            console.error('Error reading file:', err);
            return false;
        }
    }
    function appendId(id) {
        try {
            let array = [];
            if (fs.existsSync(FILENAME)) {
                let data = fs.readFileSync(FILENAME, 'utf8').trim();
                array = data ? JSON.parse(data) : [];
            }
    
            if (!array.includes(id)) {
                array.push(id);
                fs.writeFileSync(FILENAME, JSON.stringify(array, null, 2));
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }
    if (idExists(infos.id)) {
        return
    }
    // INICIO DO SETOR DE ENVIAR PARA O DISCORD
    else {
        //appendId(infos.id)
        const embed = new EmbedBuilder()
            embed.setAuthor({
                name: `Jogo grátis na ${infos.plat}`,
            });
            embed.setTitle(`${infos.title}`);
            embed.setURL(`${infos.link}`);
            embed.setDescription(`Preço original: ${infos.price}\nGêneros: ${infos.categoria}\nRating: ${infos.rating}\nDisponível de: ${infos.from}\nAté: ${infos.to}`);
            embed.setImage(`${infos.img}`);
            embed.setThumbnail(`${infos.icon}`);
            embed.setColor(`${infos.color}`);
            embed.setFooter({
                text: "Trazido para você por Gahtee!",
                iconURL: "https://cdn.discordapp.com/avatars/214513653033074688/42a78e5112a68b2ea252bf08837a39f5.png",
            });

        webhookClient.send({
            content: `<@&${process.env.ROLE}>`,
            username: 'Myst Jogos',
            avatarURL: 'https://cdn.discordapp.com/app-icons/1222331266561736946/3f67dc154faf02afe12fa9630045cd12.png',
            embeds: [embed]
        });
        appendId(infos.id)
    }
});