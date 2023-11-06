

import {
    App, Perfil, Postagem, RedeSocial, RepositorioDePerfis, RepositorioDePostagens
} from "../cls/cls"
import prompt from "prompt-sync"

function main() {
    const profiles: Perfil[] = []
    const posts: Postagem[] = []
    const repProfiles: RepositorioDePerfis = new RepositorioDePerfis(profiles)
    const repPosts: RepositorioDePostagens = new RepositorioDePostagens(posts)
    const socialMedia: RedeSocial = new RedeSocial(repProfiles, repPosts)
    const app = new App(socialMedia, true)
}

main()
