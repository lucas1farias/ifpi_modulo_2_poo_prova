

import {
    App, Perfil, Postagem, RedeSocial, RepositorioDePerfis, RepositorioDePostagens
} from "../cls/cls"
import {Algorithm} from "../tests/app"
import prompt from "prompt-sync"

function main() {
    const profiles: Perfil[] = []
    const posts: Postagem[] = []
    const repProfiles: RepositorioDePerfis = new RepositorioDePerfis(profiles)
    const repPosts: RepositorioDePostagens = new RepositorioDePostagens(posts)
    const socialMedia: RedeSocial = new RedeSocial(repProfiles, repPosts)
    
    const exe = prompt()
    console.log("Qual algoritmo deve ser executado?\n1. Principal\n2. Testes")
    let option = exe(">>> ")
    switch(option) {
        case "0":
            return
        case "1":
            new App(socialMedia, true)
            break
        case "2":
            new Algorithm(true) 
            break
        default:
            console.log("Opção inválida!")
    }
    // option === "1" ? new App(socialMedia, true) : new Algorithm(true)  
    // const testAlgorithm: Algorithm = new Algorithm()
    // const app: App = new App(socialMedia, true)
}

main()
