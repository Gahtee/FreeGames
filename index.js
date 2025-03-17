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
        } catch (e) {
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
            pri = '0' + pri + '0';
        } else if (pri.length === 2) {
            pri = '0' + pri;
        }
        const integerPart = pri.slice(0, -2);
        const decimalPart = pri.slice(-2);
        return `R$ ${integerPart},${decimalPart}`
    }
    function isblank(text) {
        try {
            if (text !== undefined && text !== null && text !== '') {
                return true
            }
            else { return false }
        } catch { console.log(e); return false }
    }
    function date(dateString) {
        const formattedString = dateString.replace(' ', 'T');
        const date = new Date(formattedString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${hours-3}:${minutes} ${day}/${month}/${year}`;
    }
    const clt = await xml(element)
    if (clt.feed && clt.feed.entry) {
        const entries = Array.isArray(clt.feed.entry) ? clt.feed.entry : [clt.feed.entry];
        for (const cfe of entries) {
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
            try {
                if (isblank(cfe.id.split("https://phenx.de/loot/")[1]) == true) { infos.id = cfe.id.split("https://phenx.de/loot/")[1] }
                if (cfe.title.includes("Steam") && infos.id !== 0) {
                    infos.plat = "Steam";
                    infos.color = "66c0f4";
                    if (isblank(cfe.link?.["@_href"])) infos.price = await checkprice(cfe.link["@_href"])
                    infos.icon = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/512px-Steam_icon_logo.svg.png";
                    if (isblank(cfe.content?.div?.img?.["@_src"])) infos.img = cfe.content.div.img["@_src"]
                    const genresList = cfe.content?.div?.ul?.ul?.li?.find(item => item.b === "Genres:")
                    if (genresList) { infos.categoria = genresList["#text"] }
                    if (Array.isArray(cfe.content?.div?.ul?.ul?.li) && isblank(cfe.content?.div?.ul?.ul?.li[3]?.["#text"])) { infos.categoria = cfe.content.div.ul.ul.li[3]["#text"] }
                    if (Array.isArray(cfe.content?.div?.ul?.ul?.li) &&
                        isblank(cfe.content?.div?.ul?.ul?.li[0]?.a?.["#text"]?.split("Steam ")[1]?.split("recommendations")[0] + "Recomendações)")) {
                        const ratingText = cfe.content?.div?.ul?.ul?.li[0]?.a?.["#text"];
                        if (ratingText) {
                            infos.rating = ratingText.split("Steam ")[1].split("recommendations")[0] + "Recomendações)";
                        }
                    }
                }
                else if (cfe.title.includes("Epic") && infos.id !== 0) {
                    infos.plat = "Epic Games"
                    infos.color = "FFFFFF"
                    infos.icon = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Epic_Games_logo.svg/800px-Epic_Games_logo.svg.png"
                    let links = "sem dados";
                    try {
                        if (Array.isArray(cfe.content?.div?.ul?.ul?.li[0]?.a)) {
                            for (const a of cfe.content.div.ul.ul.li[0].a) {
                                if (a["@_href"]?.includes("steampowered")) {
                                    links = a["@_href"];
                                    if (a["#text"]) {
                                        infos.rating = a["#text"].split("Steam ")[1].split("recommendations")[0] + "Recomendações)";
                                    }
                                }
                            }
                        }
                        if (links && isblank(cfe.content?.div?.ul?.ul?.li[4]?.["#text"])) {
                            infos.price = await checkprice(links);
                            infos.categoria = cfe.content?.div?.ul?.ul?.li[4]?.["#text"];
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
                if (isblank(cfe.content.div.img["@_src"]) == true) { infos.img = cfe.content.div.img["@_src"] }
                if (isblank(cfe.content?.div?.ul?.li?.[0]?.["#text"]) == true) { infos.from = date(cfe.content.div.ul.li[0]["#text"]); }
                if (isblank(cfe.content?.div?.ul?.li?.[1]?.["#text"]) == true) { infos.to = date(cfe.content.div.ul.li[1]["#text"]); }
                if (isblank(cfe.title?.split(") - ")[1]) == true) { infos.title = cfe.title.split(") - ")[1]; }
                if (isblank(cfe.link?.["@_href"]?.split("/home")[0]) == true) { infos.link = cfe.link["@_href"].split("/home")[0]; }
                // - FIM DO SETOR DE HANDLING DO XML -

                // - SETOR DE HANDINLG DO TXT PARA EVITAR DUPLICATAS -
                if (idExists(infos.id)) {
                    continue;
                }
                // INICIO DO SETOR DE ENVIAR PARA O DISCORD
                else {
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
                    console.log('mandou o', infos.id)
                    appendId(infos.id)
                }
            } catch (error) {
                console.error("Error in loop:", error);
            }
        }
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
    }
});