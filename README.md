# FreeGames
<!---Esses são exemplos. Veja https://shields.io para outras pessoas ou para personalizar este conjunto de escudos. Você pode querer incluir dependências, status do projeto e informações de licença aqui--->

![GitHub repo size](https://img.shields.io/github/repo-size/gahtee/FreeGames?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/Gahtee/FreeGames?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/Gahtee/FreeGames?style=for-the-badge)
![Bitbucket open issues](https://img.shields.io/bitbucket/issues/Gahtee/FreeGames?style=for-the-badge)
![Bitbucket open pull requests](https://img.shields.io/bitbucket/pr-raw/Gahtee/FreeGames?style=for-the-badge)

> Este é um bot de discord com o propósito de publicação de jogos grátis em um canal determinado.
> Ele pega as postagens do xml e manda em determinado canal.
> Nada disso seria possível sem o [lootscraper](https://github.com/eikowagenknecht/lootscraper). meus sinceros agradecimentos.


## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:
* Você instalou a versão mais recente de `<NodeJS>`
* Você tem uma máquina `<x64/x86 ou ARM64>`.

## 🚀 Instalando a FreeGames

Para instalar o FreeGames, siga estas etapas:

Windows e Linux:
```
git clone https://github.com/Gahtee/FreeGames.git
cd FreeGames
npm i
```

## ☕ Usando a FreeGames


Copie o arquivo .env.example para .env e edite-o.
```
cp .env.example .env
nano .env
```
```
note que o webhook do discord tem que começar com discord.com. discordapp.com não funcionará, mas você pode apenas trocar o nome.
```
Recomendo usar um cronjob para 5 minutos
```
node index.js
```

## 📫 Contribuindo para a FreeGames
<!---Se o seu README for longo ou se você tiver algum processo ou etapas específicas que deseja que os contribuidores sigam, considere a criação de um arquivo CONTRIBUTING.md separado--->
Para contribuir com a FreeGames, siga estas etapas:

1. Bifurque este repositório.
2. Crie um branch: `git checkout -b <nome_branch>`.
3. Faça suas alterações e confirme-as: `git commit -m '<mensagem_commit>'`
4. Envie para o branch original: `git push origin FreeGames / <local>`
5. Crie a solicitação de pull.

Como alternativa, consulte a documentação do GitHub em [como criar uma solicitação pull](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## 🤝 Colaboradores

Agradecemos às seguintes pessoas que contribuíram para este projeto:

<table>
  <tr>
    <td align="center">
      <a href="#">
        <img src="https://avatars3.githubusercontent.com/u/83777687" width="100px;" alt="Foto do Gahtee no GitHub"/><br>
        <sub>
          <b>Gahtee</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/eikowagenknecht/lootscraper">
        <img src="https://media.githubusercontent.com/media/eikowagenknecht/lootscraper/main/images/ls_640_360.png" width="100px;" alt="Foto do novo usuário"/><br>
        <sub>
          <b>Lootscraper</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

## 📝 Licença

Esse projeto está sob licença. Veja o arquivo [LICENÇA](LICENSE) para mais detalhes.

[⬆ Voltar ao topo](#nome-do-projeto)<br>
