


import prompt from "prompt-sync"
import {lucas, gabriel, aleksandro} from "./perfis"
import {lucasPostA, monitoria, lanche, brasil} from "./postagens"
import {animals, badger, manha, tiktok, wrongPost} from "./postagens_avancadas"
import {repProfiles, repPosts, eclipse} from "./repositorios"
import {Postagem, PostagemAvancada} from "../cls/cls"

export class Algorithm {
    auto: boolean
    input
    operation: string
    operationPostagem: string
    operationPostagemAvancada: string
    operationRepositorioPerfis: string
    operationRepositorioPostagens: string
    operationRedeSocial: string
    
    constructor(auto: boolean=false) {
       this.auto = auto
       this.input = prompt()
       this.operation = ""
       this.operationPostagem = ""
       this.operationPostagemAvancada = ""
       this.operationRepositorioPerfis = ""
       this.operationRepositorioPostagens = ""
       this.operationRedeSocial = ""
       this.auto ? this.start() : null
    }

    menu(): string {
        return `
        ===== TESTES =====
        0. Sair
        
        ===== CLASSES =====
        1. Postagem
        2. PostagemAvancada
        3. RepositorioDePerfis
        4. RepositorioDePostagens
        5. RedeSocial`
    }

    menuPostagem(): string {
        return `
        ===== MÉTODOS DA CLASSE: Postagem =====
        1. Curtir
        2. DesCurtir
        3. EhPopular
        `
    }

    menuPostagemAvancada(): string {
        return `
        ===== MÉTODOS DA CLASSE: PostagemAvancada =====
        1. adicionarHashtag
        2. existeHashtag
        3. decrementarVisualizacoes
        `
    }

    menuRepositorioDePerfis(): string {
        return `
        ===== MÉTODOS DA CLASSE: RepositorioDePerfis =====
        1. incluir
        2. consultar
        `
    }

    menuRepositorioDePostagens(): string {
        return `
        ===== MÉTODOS DA CLASSE: RepositorioDePostagens =====
        1. incluir
        2. consultar`
    }
    
    menuRedeSocial(): string {
        return `
        ===== MÉTODOS DA CLASSE: RedeSocial =====
        1. incluirPerfil
        2. consultarPerfil
        3. incluirPostagem
        4. consultarPostagens
        5. curtir
        6. descurtir
        7. decrementarVisualizacoes
        8. exibirPostagensPorPerfil
        9. exibirPostagensPorHashtags`
    }

    requestInput(sentence: string, empty: boolean=true): string {
        console.log(sentence)
        if (empty) {
            const data = this.input("")
            return data
        } else {
            const data = this.input(">>> ")
            return data
        }
    }

    hitEnter(): void {
        this.requestInput(">>> APERTE ENTER <<<")
    }

    start(): void {
        do {
            console.clear()
            console.log(this.menu())
            this.operation = this.requestInput("Digite o número da operação", false)
            this.conditionalsMainMenu()
            
        } while (this.operation != "0")
        
        console.log("\n===== AVISO =====\nAplicação encerrada!")
        this.hitEnter()
    }

    conditionalsMainMenu(): void {
        switch(this.operation) {
            case "1":
                console.log(this.menuPostagem())
                this.operationPostagem = this.requestInput("Digite o número da operação", false)
                this.conditionalsPostagem()
                break
            case "2":
                console.log(this.menuPostagemAvancada())
                this.operationPostagemAvancada = this.requestInput("Digite o número da operação", false)
                this.conditionalsPostagemAvancada()
                break
            case "3":
                console.log(this.menuRepositorioDePerfis())
                this.operationRepositorioPerfis = this.requestInput("Digite o número da operação", false)
                this.conditionalsRepositorioDePerfis()
                break
            case "4":
                console.log(this.menuRepositorioDePostagens())
                this.operationRepositorioPostagens = this.requestInput("Digite o número da operação", false)
                this.conditionalsRepositorioDePostagens()
                break
            case "5":
                console.log(this.menuRedeSocial())
                this.operationRedeSocial = this.requestInput("Digite o número da operação", false)
                this.conditionalsRedeSocial()
                break
        }
    }

    conditionalsPostagem(): void {
        switch(this.operationPostagem) {
            case "1":
                this.PostagemCurtir()
                this.hitEnter()
                break
            case "2":
                this.PostagemDescurtir()
                this.hitEnter()
                break
            case "3":
                this.PostagemEhPopular()
                this.hitEnter()
                break
            default:
                console.log("Operações vão de 1 a 3")
                this.hitEnter()
        }
    }

    conditionalsPostagemAvancada(): void {
        switch(this.operationPostagemAvancada) {
            case "1":
                this.PostagemAvancadaAdicionarHashtag()
                this.hitEnter()
                break
            case "2":
                this.PostagemAvancadaExisteHashtag()
                this.hitEnter()
                break
            case "3":
                this.PostagemAvancadaDecrementarVisualizacoes()
                this.hitEnter()
                break
            default:
                console.log("Operações vão entre 1 a 3")
                this.hitEnter()
        }
    }

    conditionalsRepositorioDePerfis(): void {
        switch(this.operationRepositorioPerfis) {
            case "1":
                this.RepositorioDePerfisIncluir()
                this.hitEnter()
                break
            case "2":
                this.RepositorioDePerfisConsultar()
                this.hitEnter()
                break
            default:
                console.log("Operações vão entre 1 e 2")
                this.hitEnter()
        }
    }

    conditionalsRepositorioDePostagens(): void {
        switch(this.operationRepositorioPostagens) {
            case "1":
                this.RepositorioDePostagensIncluir()
                this.hitEnter()
                break
            case "2":
                this.RepositorioDePostagensConsultar()
                this.hitEnter()
                break
            default:
                console.log("Operações vão entre 1 e 2")
                this.hitEnter()
        }
    }

    conditionalsRedeSocial(): void {
        switch(this.operationRedeSocial) {
            case "1":
                this.RedeSocialIncluirPerfil()
                this.hitEnter()
                break
            case "2":
                this.RedeSocialConsultarPerfil()
                this.hitEnter()
                break
            case "3":
                this.RedeSocialIncluirPostagem()
                this.hitEnter()
                break
            case "4":
                this.RedeSocialConsultarPostagem()
                this.hitEnter()
                break
            case "5":
                this.RedeSocialCurtir()
                this.hitEnter()
                break
            case "6":
                this.RedeSocialDescurtir()
                this.hitEnter()
                break
            case "7":
                this.RedeSocialDecrementarVisualizacoes()
                this.hitEnter()
                break
            case "8":
                this.RedeSocialExibirPostagensPorPerfil()
                this.hitEnter()
                break
            case "9":
                this.RedeSocialExibirPostagensPorHashtags()
                this.hitEnter()
                break
            default:
                console.log("Opções são entre 1 a 9!")
                this.hitEnter()
                break
        }
    }

    PostagemCurtir(): void {
        console.log("\n========== TESTE DE CURTIR UMA POSTAGEM ==========")
        console.log("Quantos likes têm a postagem alvo?", lucasPostA.curtidas)
        console.log("Tentando curtir a postagem alvo")
        lucasPostA.curtir()
        console.log("Quantos likes têm a postagem alvo?", lucasPostA.curtidas)
    }

    PostagemDescurtir(): void {
        console.log("\n========== TESTE DE DESCURTIR UMA POSTAGEM ==========")
        console.log("Quantos likes têm a postagem alvo?", lucasPostA.curtidas)
        console.log("Tentando descurtir a postagem alvo")
        lucasPostA.descurtir()
        console.log("Quantos likes têm a postagem alvo?", lucasPostA.curtidas)
    }

    PostagemEhPopular(): void {
        console.log("\n========== TESTE PARA SABER SE UMA POSTAGEM É POPULAR ==========")
        lucasPostA.curtidas = 50
        lucasPostA.descurtidas = 20
        console.log("Curtidas atuais da postagem alvo:", lucasPostA.curtidas)
        console.log("Descurtidas atuais da postagem alvo:", lucasPostA.descurtidas)
        console.log("A postagem alvo é popular?", lucasPostA.ehPopular())
        console.log(`Quanto é 50% de ${lucasPostA.descurtidas}?`, lucasPostA.descurtidas * (50/100))
        console.log("Reduzindo curtidas de 50 para 9")
        lucasPostA.curtidas = 9
        console.log("Curtidas atuais da postagem alvo:", lucasPostA.curtidas)
        console.log("A postagem alvo é popular?", lucasPostA.ehPopular())
        console.log("Quantos likes a postagem precisa pra ser popular?", (lucasPostA.descurtidas * (50/100)) - lucasPostA.curtidas)
    }

    PostagemAvancadaAdicionarHashtag(): void {
        console.log("\n========== TESTE PARA ADD HASHTAG NUMA POSTAGEM AVANÇADA ==========")
        console.log("-----> A instância abaixo terá uma nova hashtag add ao seu array de hashtags")
        console.log(tiktok)
        // The instance itself must be used, so its array of hashtags can be recognized
        console.log("-----> Tentando adicionar a hashtag: #conhecimento")
        tiktok.adicionarHashtag("#conhecimento")
        console.log("-----> A instância agora deve ter a hashtag #conhecimento")
        console.log(tiktok)
    }

    PostagemAvancadaExisteHashtag(): void {
        console.log("\n========== TESTE PARA SABER SE UMA HASHTAG JÁ EXISTE NUMA POSTAGEM AVANÇADA ==========")
        console.log("-----> Tentando adicionar #conhecimento a postagem alvo")
        tiktok.adicionarHashtag("#conhecimento")
        console.log("-----> A postagem avançada abaixo possui a hashtag #conhecimento")
        console.log(tiktok.hashtags)
        console.log("-----> #conhecimento existe na postagem alvo?", tiktok.existeHashtag("#conhecimento"))
        console.log("-----> Tentando adicionar #conhecimento a mesma postagem")
        tiktok.adicionarHashtag("#conhecimento")
        console.log(tiktok.hashtags)
        let repeated: number = 0
        tiktok.hashtags.forEach((hash: string) => {"#conhecimento" == hash ? repeated++ : null})
        console.log("Quantas vezes a hastag #conhecimento se repetiu?", repeated)
    }

    PostagemAvancadaDecrementarVisualizacoes(): void {
        console.log("\n========== TESTE PARA SABER VIEWS RESTANTES DE UMA POSTAGEM AVANÇADA ANTES DE SER REMOVIDA ==========")
        console.log("Quantas visualizações restam à postagem alvo?", animals.visualizacoesRestantes)
        console.log("-----> Tentativa de decrementar a view da postagem alvo")
        animals.decrementarVisualizacoes()
        console.log("Quantas visualizações restam à postagem alvo?", animals.visualizacoesRestantes)
    }

    RepositorioDePerfisIncluir(): void {
        console.log("\n========== TESTE PARA SABER SE O ARRAY DE PERFIS RECEBE OBJETO DE PERFIL ==========")
        console.log("-----> Array atualmente:")
        console.log(repProfiles.perfis)
        console.log("Tentando incluir um perfil")
        repProfiles.incluir(lucas)
        console.log("-----> Array após a inclusão:")
        console.log(repProfiles.perfis)
        console.log("Tentando incluir o mesmo perfil")
        repProfiles.incluir(lucas)
        console.log("-----> Array após a tentativa:")
        console.log(repProfiles.perfis)
    }

    RepositorioDePerfisConsultar(): void {
        console.log("\n========== TESTE PARA SABER SE UM PERFIL EXISTE NO REPOSITÓRIO DE PERFIS ==========")
        console.log("-----> Adicionando um perfil alvo")
        repProfiles.incluir(lucas)
        console.log("-----> Array de perfis atualmente:")
        console.log(repProfiles.perfis)
        console.log("-----> Consultando um perfil de id: ", lucas.id)
        console.log(`O perfil de id ${lucas.id} foi encontrado?`)
        console.log(repProfiles.consultar(lucas.id))
        console.log("-----> Consultando um perfil de id: 2")
        console.log(`O perfil de id 2 foi encontrado?`)
        console.log(repProfiles.consultar(2))
    }

    RepositorioDePostagensIncluir(): void {
        console.log("========== TESTE PARA SABER SE POSTAGEM ADD AO REPOSITÓRIO DE POSTAGENS ==========")
        console.log("-----> Array de postagens atual:")
        console.log(repPosts.postagens)
        console.log("-----> Tentando adicionar 1 postagem regular e 2 avançadas")
        repPosts.incluir(lucasPostA)
        repPosts.incluir(animals)
        repPosts.incluir(badger)
        console.log("-----> Array de postagens atualizado:")
        console.log(repPosts.postagens)
    }
    
    RepositorioDePostagensConsultar(): void {
        console.log("========== TESTE PARA OBTER POSTAGENS RELACIONADAS COM ALGUM PERFIL OU HASHTAG ==========")
        console.log("-----> Caso a postagem seja comum: procura pelo id do perfil")
        console.log("-----> Caso a postagem seja avançada: procura por uma hashtag dentro da postagem")
        
        repPosts.incluir(lucasPostA)
        repPosts.incluir(animals)
        repPosts.incluir(badger)
        repPosts.incluir(tiktok)
        repPosts.incluir(monitoria)
        
        console.log("-----> Array de postagens atual:")
        console.log(repPosts.postagens)

        console.log("-----> Caso 1: procurar postagens do perfil de id: ", lucasPostA.perfil.id)
        console.log(repPosts.consultar(lucas.id, ""))
        console.log("-----> Caso 2: procurar postagens relacionadas a hashtag #animais")
        // If post is advanced, ignore id by putting an invalid value
        console.log(repPosts.consultar(-1, "#animais"))
    }

    RedeSocialIncluirPerfil(): void {
        console.log("========== TESTE PARA INCLUSÃO DE PERFIL NUMA REDE SOCIAL ==========")
        repProfiles.incluir(aleksandro)
        repProfiles.incluir(gabriel)
        console.log("Perfis registrados atualmente:")
        console.log(eclipse.repPerfis)
        console.log("-----> Tentando incluir um perfil que já existe")
        eclipse.incluirPerfil(gabriel)
        console.log("Perfis registrados atualmente:")
        console.log(eclipse.repPerfis)
        eclipse.incluirPerfil(lucas)
        console.log("-----> Tentando incluir um perfil que não existe")
        console.log("Perfis registrados atualmente:")
        console.log(eclipse.repPerfis)
    }

    RedeSocialConsultarPerfil(): void {
        console.log("========== TESTE PARA SABER SE UM PERFIL EXISTE NUMA REDE SOCIAL ==========")
        eclipse.incluirPerfil(lucas)
        console.log("-----> Perfis registrados atualmente:")
        console.log(eclipse.repPerfis)
        console.log(`O perfil ${lucas.nome} existe no repositório de perfis?`)
        console.log(eclipse.consultarPerfil(lucas.id, lucas.nome, lucas.email))
        console.log(`O perfil ${aleksandro.nome} existe no repositório de perfis?`)
        console.log(eclipse.consultarPerfil(aleksandro.id, aleksandro.nome, aleksandro.email))
    }

    RedeSocialIncluirPostagem(): void {
        console.log("===== TESTE INCLUSÃO DE POSTAGEM NO REPOSITÓRIO DE POSTAGENS DA REDE SOCIAL =====")
        
        eclipse.incluirPostagem(animals)
        eclipse.incluirPostagem(badger)
        eclipse.incluirPostagem(brasil)
        eclipse.incluirPostagem(lanche)
        eclipse.incluirPostagem(lucasPostA)
        eclipse.incluirPostagem(monitoria)
        eclipse.incluirPostagem(tiktok)
        
        console.log("-----> Postagens registradas atualmente:")
        console.log(eclipse.repPosts)
        console.log("-----> Tamanho atual:", eclipse.repPosts.postagens.length)
        
        eclipse.incluirPostagem(lucasPostA)
        console.log("Tentando add uma postagem repetida: ", eclipse.repPosts.postagens.length)
        
        eclipse.incluirPostagem(wrongPost)
        console.log("Tentando add uma postagem com formatação incorreta: ", eclipse.repPosts.postagens.length)
    }

    RedeSocialConsultarPostagem(): void {
        console.log("\n===== TESTE: OBTER POSTAGEM DE REDE SOCIAL =====")

        eclipse.incluirPostagem(animals)
        eclipse.incluirPostagem(badger)
        
        eclipse.incluirPostagem(lanche)
        eclipse.incluirPostagem(monitoria)
    
        console.log("-------> Adição de 2 postagens pertencentes a pessoa Gabriel")
        console.log("-------> Array de postagens atual: ")
        console.log(eclipse.repPosts.postagens)
        console.log("-------> Postagens encontradas de Gabriel")
        console.log(eclipse.consultarPostagens(gabriel.id, "", "", gabriel))
        console.log("-------> Postagens encontradas relacionadas com #animais")
        console.log(eclipse.consultarPostagens(-1, "", "#animais", lucas))
    }

    RedeSocialCurtir(): void {
        console.log("\n===== TESTE: CURTIR UMA POSTAGEM =====")

        eclipse.incluirPostagem(animals)
        eclipse.incluirPostagem(badger)
        eclipse.incluirPostagem(tiktok)
        eclipse.incluirPostagem(lanche)
        eclipse.incluirPostagem(monitoria)

        console.log("Quantas curtidas têm a postagem alvo?", tiktok.curtidas)
        console.log("-----> Tentando curtir a postagem alvo")
        eclipse.curtir(tiktok.id)
        console.log("Quantas curtidas têm a postagem alvo?", tiktok.curtidas)
        
        console.log("Quantas curtidas têm uma postagem independente?", brasil.curtidas)
        console.log("-----> Tentando curtir essa postagem")
        eclipse.curtir(brasil.id)
        console.log("Quantas curtidas têm essa postagem independente?", brasil.curtidas)
    }

    RedeSocialDescurtir(): void {
        console.log("\n===== TESTE: DESCURTIR UMA POSTAGEM NUMA REDE SOCIAL =====")
        eclipse.incluirPostagem(badger)
        console.log("Adicionando duas curtidas à postagem alvo")
        eclipse.curtir(badger.id)
        eclipse.curtir(badger.id)
        console.log("Array de postagens atual:")
        console.log(eclipse.repPosts.postagens)
        console.log("Tentando descurtir a postagem alvo")
        eclipse.descurtir(badger.id)
        console.log("Array de postagens atual:")
        console.log(eclipse.repPosts.postagens)
        console.log("Tentando curtir uma postagem independente")
        eclipse.curtir(brasil.id)
        console.log(brasil)
    }

    RedeSocialDecrementarVisualizacoes(): void {
        console.log("\n===== TESTE: REDUZIR VIEWS DE UMA POSTAGEM NUMA REDE SOCIAL =====")
        eclipse.incluirPostagem(manha)
        console.log("Array de postagens atual:")
        console.log(eclipse.repPosts.postagens)
        console.log("-----> Tentando reduzir as views da postagem alvo")
        eclipse.decrementarVisualizacoes(manha)
        console.log("Array de postagens atual:")
        console.log(eclipse.repPosts.postagens)
        console.log("-----> Tentando reduzir as views da postagem alvo com 0 views")
        eclipse.decrementarVisualizacoes(manha)
        console.log("Array de postagens atual:")
        console.log(eclipse.repPosts.postagens)
    }

    RedeSocialExibirPostagensPorPerfil(): void {
        console.log("===== TESTE: FILTRAR POSTAGENS AVANÇADAS DE UM PERFIL ESPECÍFICO =====")
        console.log("-----> Inserindo 4 postagens de uma mesmo pessoa")
        console.log("-----> 1 delas é avançada e não possui mais views restantes")
        
        eclipse.incluirPostagem(lucasPostA)
        eclipse.incluirPostagem(animals)
        eclipse.incluirPostagem(badger)
        eclipse.incluirPostagem(tiktok)
        console.log("Array de postagens atualmente:")
        console.log(eclipse.repPosts.postagens)
        console.log("==============================================================================")
        const postsFound: Postagem[] = eclipse.exibirPostagensPorPerfil(lucas.id)
        console.log(postsFound)
        postsFound.forEach(i => {
            i instanceof PostagemAvancada ? eclipse.decrementarVisualizacoes(i) : null 
        })
    }

    RedeSocialExibirPostagensPorHashtags(): void {
        console.log("===== TESTE: FILTRAR POSTAGENS AVANÇADAS DE UMA HASHTAG ESPECÍFICA =====")
        console.log("-----> Inserindo 4 postagens de uma mesmo pessoa")
        
        eclipse.incluirPostagem(lucasPostA)
        eclipse.incluirPostagem(animals)
        eclipse.incluirPostagem(badger)
        eclipse.incluirPostagem(tiktok)

        console.log("-----> 1 delas é comum e 3 são avançadas")
        console.log("Array de postagens atual:")
        console.log(eclipse.repPosts.postagens)
        
        console.log("-----> Das 2 avançadas relacionadas com a hashtag, somente 1 têm pelo menos 1 view restante")
        console.log("-----> Sendo assim, somente 1 postagem avançada deve continuar")
        const postsFound: Postagem[] = eclipse.exibirPostagensPorHashtag("#animais")
        
        postsFound.forEach(i => {
            i instanceof PostagemAvancada ? eclipse.decrementarVisualizacoes(i) : null 
        })
        console.log("-----> Array de postagens atual:")
        console.log(postsFound)
    }
}
