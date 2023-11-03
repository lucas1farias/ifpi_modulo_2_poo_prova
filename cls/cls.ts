

import prompt from "prompt-sync"
import * as manager from "fs-extra"

export class File {
    osPath: string
    private _content: string
    
    constructor(osPath: string, content: string) {
        this.osPath = osPath
        this._content = content
    }

    get content(): string {
        return this._content
    }

    set content(newValue: string) {
        this._content = newValue
    }
    write(): void {
        manager.writeFileSync(this.osPath, this.content, "utf8")
    }
    append(): void {
        manager.appendFileSync(this.osPath, this.content, "utf8")
    }
    read(): string {
        return manager.readFileSync(this.osPath, "utf8")
    }
}

export class Perfil {
    private _id: number 
    private _nome: string
    private _email: string
    
    constructor(id: number, nome: string, email: string) {
        this._id = id
        this._nome = nome
        this._email = email
    }

    get id(): number {
        return this._id
    }

    get nome(): string {
        return this._nome
    }

    get email(): string {
        return this._email
    }
}

export class Postagem {
    _id: number
    _texto: string
    _curtidas: number
    _descurtidas: number
    _data: string
    _perfil: Perfil

    constructor(id: number, texto: string, curtidas: number, descurtidas: number, data: string, perfil: Perfil) {
        this._id = id
        this._texto = texto
        this._curtidas = curtidas
        this._descurtidas = descurtidas
        this._data = data
        this._perfil = perfil
    } 

    get id(): number {
        return this._id
    }

    get texto(): string {
        return this._texto
    }

    get curtidas(): number {
        return this._curtidas
    }

    set curtidas(newValue: number) {
        this._curtidas = newValue
    }

    get descurtidas(): number {
        return this._descurtidas
    }

    set descurtidas(newValue: number) {
        this._descurtidas = newValue
    }

    get data(): string {
        return this._data
    }

    get perfil(): Perfil {
        return this._perfil
    }

    curtir(): void {
        this.curtidas +=1
    }

    descurtir(): void {
        this.curtidas -=1
    }

    ehPopular(): boolean {
       return this.curtidas > (this.descurtidas * 50/100) ? true : false
    }
}

export class PostagemAvancada extends Postagem {
    private _hashtags: string[]
    private _visualizacoesRestantes: number 
    
    constructor(
        id: number, texto: string, curtidas: number, descurtidas: number, data: string, perfil: Perfil,
        hashtags: string[], visualizacoesRestantes: number
        ) {
        super(id, texto, curtidas, descurtidas, data, perfil)
        this._hashtags = hashtags
        this._visualizacoesRestantes = visualizacoesRestantes 
    }

    get hashtags(): string[] {
        return this._hashtags
    }

    get visualizacoesRestantes(): number {
        return this._visualizacoesRestantes
    }

    set visualizacoesRestantes(newValue: number) {
        this._visualizacoesRestantes = newValue
    }
    
    // Use the own instance to make the checkage, accessing its array of hastags
    adicionarHashtag(hashtag: string): void {
        this.existeHashtag(hashtag) ? null : this.hashtags.push(hashtag)
    }

    existeHashtag(hashtag: string): boolean {
        return this.hashtags.includes(hashtag) ? true : false
    }

    decrementarVisualizacoes(): void {
        this.visualizacoesRestantes = this._visualizacoesRestantes - 1
    }
}

export class RepositorioDePerfis {
    private _perfis: Perfil[]
    // added later
    lastId: number

    constructor(perfis: Perfil[]) {
        this._perfis = perfis
        // added later
        this.lastId = 0
    }

    get perfis(): Perfil[] {
        return this._perfis
    }

    incluir(perfil: Perfil): void {
        !this.consultar(perfil.id) ? this.perfis.push(perfil) : null
    }
    
    // It is being asked to return "null", but I do not know how to do it
    consultar(id: number): Perfil {
        let searchedProfile!: Perfil
        for (let i = 0; i < this.perfis.length; i++) {
            if (id == this.perfis[i].id) {
                return this.perfis[i]
            }
        }
        return searchedProfile
    }
    
    // added later
    updateId(): void {
        this.lastId++
    }
}

export class RepositorioDePostagens {
    private _postagens: Postagem[]
    lastId: number

    constructor(postagem: Postagem[]) {
        this._postagens = postagem
        this.lastId = 0
    }

    get postagens(): Postagem[] {
        return this._postagens
    }
    
    // In here, there is no need to verify instance, it will add "Postagem" and "PostagemAvancada"
    // Why would you want to verify if a post is repeated or not? does not make sens at all
    incluir(postagem: Postagem): void {
        this.postagens.push(postagem)
    }
    
    consultar(id: number, hashtag: string): Postagem[] {
        const posts: Postagem[] = []
        
        for(let i = 0; i < this.postagens.length; i++) {
            const currentPost: Postagem = this.postagens[i]
            id == currentPost.perfil.id ? posts.push(currentPost) : null 
            
            // Normal post uses profile as search reference 
            // if (currentPost instanceof Postagem && !(currentPost instanceof PostagemAvancada)) {
            //     const currentPostPersonId: number = currentPost.perfil.id
            //     id == currentPostPersonId ? posts.push(currentPost) : null  
            // }
            // Advanced post uses hashtag as reference
            
            if (currentPost instanceof PostagemAvancada) {
                currentPost.hashtags.includes(hashtag) ? posts.push(currentPost) : null
            }
            
        }
        return posts
    }

    updateId() {
        this.lastId++
    }
}

export class RedeSocial {
    private _repPerfis: RepositorioDePerfis
    private _repPosts: RepositorioDePostagens

    constructor(repPerfis: RepositorioDePerfis, repPosts: RepositorioDePostagens) {
        this._repPerfis = repPerfis
        this._repPosts = repPosts
    }

    get repPerfis(): RepositorioDePerfis {
        return this._repPerfis
    }

    get repPosts(): RepositorioDePostagens {
        return this._repPosts
    }

    incluirPerfil(perfil: Perfil): void {
        for (let i = 0; i < this.repPerfis.perfis.length; i++) {
            if (perfil.id == this.repPerfis.perfis[i].id) {
                return
            }
        }
        if (
            perfil.nome != undefined && perfil.nome != "" &&
            perfil.email != undefined && perfil.email != ""
            ) {
            (<RepositorioDePerfis> this.repPerfis).incluir(perfil)
        }
    }

    consultarPerfil(id: number, nome: string, email: string): Perfil {
        return (<RepositorioDePerfis> this.repPerfis).consultar(id)
    }

    incluirPostagem(postagem: Postagem): void {
        let atrib: Postagem = postagem
        const postAtribs: number[] = [
            atrib.id == undefined || atrib.id < 0 ? 1: 0,
            atrib.texto == undefined || atrib.texto == "" ? 1 : 0,
            atrib.curtidas == undefined || atrib.curtidas < 0 ? 1 : 0,
            atrib.descurtidas == undefined || atrib.descurtidas < 0 ? 1 : 0,
            atrib.data == undefined || atrib.data == "" ? 1 : 0,
            atrib.perfil == undefined ? 1 : 0
        ]
        
        const undefinedAtribs: number = postAtribs.reduce((current, next) => {return current + next})
        // If there is no invalid attribute, then the post can be checked if id has repeated
        if (undefinedAtribs == 0) {
            for (let i = 0; i < this.repPosts.postagens.length; i++) {
                if (postagem.id == this.repPosts.postagens[i].id) {
                    return
                }
            }
            // Not having a repeated if, the post can be added
            (<RepositorioDePostagens> this.repPosts).incluir(postagem)
        }
    }

    consultarPostagens(id: number, texto: string, hashtag: string, perfil: Perfil): Postagem[] {
        return (<RepositorioDePostagens>this.repPosts).consultar(id, hashtag)
    }

    curtir(idPostagem: number): void {
        for(let i = 0; i < this.repPosts.postagens.length; i++) {
            if (idPostagem == this.repPosts.postagens[i].id) {
                (<Postagem>this.repPosts.postagens[i]).curtir()
            }
        }
    }

    descurtir(idPostagem: number): void {
        for(let i = 0; i < this.repPosts.postagens.length; i++) {
            if (idPostagem == this.repPosts.postagens[i].id) {
                if (this.repPosts.postagens[i].curtidas > 0) {
                    (<Postagem>this.repPosts.postagens[i]).descurtir()
                }
            }
        }
    }

    decrementarVisualizacoes(postagem: PostagemAvancada): void {
        if (postagem.visualizacoesRestantes > 0) {
            (<PostagemAvancada> postagem).decrementarVisualizacoes()
        }
    }
    
    exibirPostagensPorPerfil(id: number): Postagem[] {
        // First: take all posts from a certain profile id
        // Others outside the "ifs" will be excluded (return false)
        let profilePosts: Postagem[] = this.repPosts.postagens.filter((i: Postagem) => {
            if (i.perfil.id == id) {
                return true
            }
            return false
        })
        
        // Second: From the current array, remove views from advanced posts
        // profilePosts.forEach(i => {
        //     i instanceof PostagemAvancada ? this.decrementarVisualizacoes(i) : null
        // })
        
        // Third: include advanced posts with 1+ views left OR regular posts
        // Others outside the "ifs" will be excluded (return false)
        profilePosts = profilePosts.filter((i: Postagem) => {
            if (i instanceof PostagemAvancada && i.visualizacoesRestantes > 0 || 
                i instanceof Postagem && !(i instanceof PostagemAvancada)) {
                return true
            }
            return false
        })
        
        return profilePosts
    }

    exibirPostagensPorHashtag(hashtag: string): PostagemAvancada[] {
        // 2 operations at once were not working, so at first: get advanced posts and recude their views
        let advancedPosts: Postagem[] = this.repPosts.postagens.filter((i: Postagem) => {
            if (i instanceof PostagemAvancada) {
                // this.decrementarVisualizacoes(i)
                return true
            }
            return false
        })
        
        // The second operation also requires asking instance in order for the 2 && work
        advancedPosts = advancedPosts.filter((i: Postagem) => {
            if (i instanceof PostagemAvancada && i.visualizacoesRestantes > 0 && i.hashtags.includes(hashtag)) {
                return true
            }
            return false
        })
        
        // This was done because I could not solve how to return "advancedPosts" without issues
        let advancedPostsFinal: PostagemAvancada[] = []
        advancedPosts.forEach(i => {
            i instanceof PostagemAvancada ? advancedPostsFinal.push(i) : null
        })
        return advancedPostsFinal
    }
}

export class App {
    private _redeSocial: RedeSocial
    
    // Content for algorithm handling
    auto: boolean
    operation: string
    input
    
    // Text files variables
    profilesTxt: File
    postsTxt: File
    profileLastId: File
    postLastId: File

    // Content for empty parameters
    mockProfile: Perfil
    mockPost: Postagem
    mockAdvancedPost: PostagemAvancada
 
    constructor(redeSocial: RedeSocial, auto: boolean=false) {
        this._redeSocial = redeSocial
        this.auto = auto
        this.input = prompt()
        this.operation = ""
        this.profilesTxt = new File("../txt/profiles.txt", "")
        this.postsTxt = new File("../txt/posts.txt", "")
        this.profileLastId = new File("../txt/last_id_profile.txt", "")
        this.postLastId = new File("../txt/last_id_post.txt", "")
        this.mockProfile = new Perfil(-1, "Void", "void@gmail.com")
        this.mockPost = new Postagem(-1, "void", 0, 0, "01-01-01", this.mockProfile)
        this.mockAdvancedPost = new PostagemAvancada(-1, "void", 0, 0, "01-01-01", this.mockProfile, ["#void"], 0)
        this.auto ? this.start() : null
    }

    get redeSocial(): RedeSocial {
        return this._redeSocial
    }

    menu(): string {
        return `
        ========== APLICAÇÃO: REDE SOCIAL ==========
        0. Sair
        1. incluir Perfil
        2. consultar Perfil
        3. incluir Postagem
        4. consultar Postagens
        5. curtir
        6. descurtir
        7. decrementar visualizações
        8. exibir postagens por perfil
        9. exibir postagens por hashtag
        
        ===== CONSULTAS =====
        10. Ver repositório de perfis
        11. Ver repositório de postagens
        `
    }
    
    requestInput(sentence: string, empty: boolean=false): string {
        console.log(sentence)
        let data: string
        empty ? data = this.input("") : data = this.input(">>> ")
        return data
    }

    requestNumberInput(sentence: string, empty: boolean=false): number {
        console.log(sentence)
        let data: number
        empty ? data = Number(this.input("")) : data = Number(this.input(">>> "))
        return data
    }

    hitEnter(): void {
        this.requestInput("\n>>> Pressione ENTER <<<", true)
    }
    
    showProfileDatabase(): void {
        console.log("\n[")
        for(let i = 0; i < this.getProfileDatabaseSize(); i++) {
            const p = this.redeSocial.repPerfis.perfis[i]
            console.log(`    { id: ${p.id}, nome: ${p.nome}, email: ${p.email} },`)
        }
        console.log("]")
    }

    showPostsDatabase(): void {
        console.log("\n[")
        for(let i = 0; i < this.getPostsDatabaseSize(); i++) {
            const p: Postagem = this.redeSocial.repPosts.postagens[i]
            if (p instanceof Postagem && !(p instanceof PostagemAvancada)) {
                // id texto curtidas descurtidas data perfil
                console.log(`    { id: ${p.id}, txt: ${p.texto}, like: ${p.curtidas} deslike: ${p.descurtidas}, data: ${p.data}, { id: ${p.perfil.id}, nome: ${p.perfil.nome} }, },`)
            }
            if (p instanceof PostagemAvancada) {
                console.log(`    { id: ${p.id}, txt: ${p.texto}, like: ${p.curtidas} deslike: ${p.descurtidas}, data: ${p.data}, { id: ${p.perfil.id}, nome: ${p.perfil.nome} }, hash: [${p.hashtags}], views: ${p.visualizacoesRestantes}, },`)
            }  
        }
        console.log("]")
    }

    showSpecificPosts(arrayPosts: Postagem[]): void {
        console.log("\n[")
        for (let i = 0; i < arrayPosts.length; i++) {
            const p: Postagem = arrayPosts[i]
            if (p instanceof Postagem && !(p instanceof PostagemAvancada)) {
                // id texto curtidas descurtidas data perfil
                console.log(`    { id: ${p.id}, txt: ${p.texto}, like: ${p.curtidas} deslike: ${p.descurtidas}, data: ${p.data}, { id: ${p.perfil.id}, nome: ${p.perfil.nome} }, }`)
            }
            if (p instanceof PostagemAvancada) {
                console.log(`    { id: ${p.id}, txt: ${p.texto}, like: ${p.curtidas} deslike: ${p.descurtidas}, data: ${p.data}, { id: ${p.perfil.id}, nome: ${p.perfil.nome} }, hash: [${p.hashtags}], views: ${p.visualizacoesRestantes}, }`)
            }  
        }
        console.log("]")
    }

    getProfileDatabaseSize(): number {
        return this.redeSocial.repPerfis.perfis.length
    }

    getPostsDatabaseSize(): number {
        return this.redeSocial.repPosts.postagens.length
    }
    
    // Main
    start(): void {
        /*
        ========== PROFILE AND POSTS LAST INDEX ==========
        Single values placed into: ["txt/last_id_profile.txt", "txt/last_id_post.txt"]
        Store into the document containers the last index value from each repository
        This way, the next object created (profile or post) will have its id based on these values
        */
        this.retrieveProfileLastId()
        this.retrievePostLastId()

        /*
        ===== PROFILE AND POSTS MANAGEMENT =====
        Retrieve content from "txt/posts.txt" and "txt/profiles.txt" before the algorithm starts
        */
        this.retrieveProfileData()
        this.retrievePostData()
        
        // Start
        console.clear()
        do {
            console.log(this.menu())
            this.operation = this.requestInput("Digite o valor da operação")
            this.conditionals()
        } while(this.operation != "0")
        
        // The wipe must happen before any change on
        this.removeAdvancedPostsWithoutViews()
        
        /*
        ========== PROFILE MANAGEMENT ==========
        Record into documents the last index from each repository
        Before recording, wipe old content, and when leaving, record new content
        */
        this.recordProfileLastId()
        this.wipeOldProfileData()    
        this.recordNewProfileData()

        /* ========== POSTS MANAGEMENT ==========
        Before recording, wipe old content, and when leaving, record new content
        */
        this.recordPostsLastId()
        this.wipeOldPostData()
        this.recordNewPostData()

        // End
        this.hitEnter()
        console.log("===== AVISO =====\nAplicação encerrada!")
    }

    conditionals(): void {
        switch(this.operation) {
            case "0":
                break
            case "1":
                console.log("===== OPERAÇÃO 1: INCLUSÃO DE PERFIL =====")
                this.incluirPerfil()
                break
            case "2":
                console.log("===== OPERAÇÃO 2: PROCURAR PERFIL =====")
                this.consultarPerfil()
                break
            case "3":
                console.log("===== OPERAÇÃO 3: INCLUSÃO DE POSTAGEM =====")
                this.incluirPostagem()
                break
            case "4":
                console.log("===== OPERAÇÃO 4: CONSULTA DE POSTAGEM =====")
                this.consultarPostagem()
                break
            case "5":
                console.log("===== OPERAÇÃO 5: CURTIR POSTAGEM =====")
                this.curtir()
                break
            case "6":
                console.log("===== OPERAÇÃO 6: DESCURTIR POSTAGEM =====")
                this.descurtir()
                break
            case "7":
                console.log("===== OPERAÇÃO 7: DECREMENTAR VIEWS =====")
                this.decrementarViews()
                break
            case "8":
                console.log("===== OPERAÇÃO 8: EXIBIR POSTAGENS POR PERFIL =====")
                this.exibirPostagensPorPerfil()
                break
            case "9":
                console.log("===== OPERAÇÃO 9: EXIBIR POSTAGENS POR HASHTAG =====")
                this.exibirPostagensPorhashtag()
                break
            case "10":
                console.log("===== OPERAÇÃO 10: VER BANCO DE PERFIS =====")
                this.viewProfiles()
                break
            case "11":
                console.log("===== OPERAÇÃO 11: VER BANCO DE POSTAGENS =====")
                this.viewPosts()
                break
            default:
                console.log("Opções permitidas: 1 a 11!")
        }
    }

    viewProfiles(): void {
        console.log("Perfis registrados", this.getProfileDatabaseSize())
        this.showProfileDatabase()
        this.hitEnter()
    }

    viewPosts(): void {
        console.log("Postagens registradas", this.getPostsDatabaseSize())
        this.showPostsDatabase()
        this.hitEnter()
    }

    // To be used before algorithm start
    retrieveProfileData(): void {
        const profilesData = this.profilesTxt.read().split("\n")
        for (let i = 0; i < profilesData.length; i++) {
            // There is an empty line after appending rows, so this is required
            if (profilesData[i] != "") {
                const p: string[] = profilesData[i].split(";")
                const retrievedProfile: Perfil = new Perfil(Number(p[0]), p[1], p[2])
                this.redeSocial.incluirPerfil(retrievedProfile)
            }
        }
    }

    // To be used before algorithm start
    retrievePostData(): void {
        const postsData = this.postsTxt.read().split("\n")
        for (let i = 0; i < postsData.length; i++) {
            // There is an empty line after appending rows, so this is required
            if (postsData[i] != "") {
                const p: string[] = postsData[i].split(";")
                const profileId: number = Number(p[5])
                const profileExists: Perfil = this.redeSocial.consultarPerfil(profileId, "void", "void")
                
                // If the id collected in the row actually belongs to a user
                if (profileExists) {
                    // Regular post
                    if (p.length == 6) {
                        const retrievedPost: Postagem = new Postagem(
                            Number(p[0]), p[1], Number(p[2]), Number(p[3]), p[4], profileExists
                        )
                        this.redeSocial.incluirPostagem(retrievedPost)
                    }
                    // Advanced post
                    if (p.length > 6) {
                        const hashtagFromRowToArray: string[] = p[6].split(",")
                        const retrievedPost: PostagemAvancada = new PostagemAvancada(
                            Number(p[0]), p[1], Number(p[2]), Number(p[3]), p[4], profileExists,
                            hashtagFromRowToArray, Number(p[7])
                        )
                        this.redeSocial.incluirPostagem(retrievedPost)
                    }
                }
            }
        }
    }

    wipeOldProfileData(): void {
        this.profilesTxt.content = ""
        this.profilesTxt.write()
    }

    wipeOldPostData(): void {
        this.postsTxt.content = ""
        this.postsTxt.write()
    }
    
    // Before algorithm ceases: update "new profile" content into its container file
    recordNewProfileData(): void {
        let row: string = ""
        for (let i = 0; i < this.redeSocial.repPerfis.perfis.length; i++) {
            const profile: Perfil = this.redeSocial.repPerfis.perfis[i]
            row = `${profile.id};${profile.nome};${profile.email}`
            this.profilesTxt.content = row + '\n'
            this.profilesTxt.append()
        }
    }
    
    // Before algorithm ceases: update "new post" content into its container file
    recordNewPostData(): void {
        for (let i = 0; i < this.redeSocial.repPosts.postagens.length; i++) {
            let row: string = ""
            const p: Postagem = this.redeSocial.repPosts.postagens[i]
            /*
            Instead of putting the entire profile content, insert only its id
                {id: 1, nome: "Lucas", email: "lucas@gmail.com"} = ;1;
            */
            if (p instanceof Postagem && !(p instanceof PostagemAvancada)) {
                row = `${p.id};${p.texto};${p.curtidas};${p.descurtidas};${p.data};${p.perfil.id}`
            }
            /*
            Instead of putting the entire profile content, insert only its id
            The array of hashtags is improper, so the array is turned into a string
                {id: 1, nome: "Lucas", email: "lucas@gmail.com"} = ;1;
                ["#gastronomia", "#estrognofe_com_farofa"] = ;#gastronomia,#estrogonofe_com_farofa;
            */
            if (p instanceof PostagemAvancada) {
                row = `${p.id};${p.texto};${p.curtidas};${p.descurtidas};${p.data};${p.perfil.id};${p.hashtags.toString()};${p.visualizacoesRestantes}`
            }
            this.postsTxt.content = row + '\n'
            this.postsTxt.append()
        }
    }

    // To be used at the cease of the algorithm
    recordPostData(): void {
        /*
        Postagem
            id: number
            texto: string
            curtidas: number
            descurtidas: number
            data: string
            perfil: Perfil
        
            PostagemAvancada
            id: number
            texto: string
            curtidas: number
            descurtidas: number
            data: string
            perfil: Perfil,
            hashtags: string[]
            visualizacoesRestantes: number
        */
        let row: string = ""
        for (let i = 0; i < this.redeSocial.repPosts.postagens.length; i++) {
            const thread: Postagem = this.redeSocial.repPosts.postagens[i]
            if (thread instanceof Postagem && !(thread instanceof PostagemAvancada)) {
                row = `${thread.id};${thread.texto};${thread.curtidas};${thread.descurtidas};${thread.data};${thread.perfil.id}`
            }
        }
        this.postsTxt.content = row
        this.postsTxt.append()
        /*
        ===== Postagem =====
        Tudo parece certo até chegar no atributo "perfil"
        O atributo "perfil" não pode ser acessado diretamente, pois é um objeto, não um dado solto
        Pelo que eu acho, a melhor opção é, ao invés de jogar o perfil, é jogado seu id
        Quando os dados forem recuperados no inciar do algoritmo
        Esse documento verificará o último índice, passando a função "consultar" de "RepositorioPerfis"
        Isso se o resultado da consulta for != de undefined

        ===== PostagemAvancada =====
        A mesma coisa de postagem, com um adicional
        Existem 2 atributos a mais: hashtags e visualizacoesRestantes
        */
    }

    recordProfileLastId(): void {
        this.profileLastId.content = `${this.redeSocial.repPerfis.lastId}`
        this.profileLastId.write()
    }

    recordPostsLastId(): void {
        this.postLastId.content = `${this.redeSocial.repPosts.lastId}`
        this.postLastId.write()
    }

    retrieveProfileLastId(): void {
        this.redeSocial.repPerfis.lastId = Number(this.profileLastId.read())
    }

    retrievePostLastId(): void {
        this.redeSocial.repPosts.lastId = Number(this.postLastId.read())
    }

    // Treatment for date handling, not complete though
    handleDate(date: string, separator: string): boolean {
        let correct: number = 0
        const dateArray: string[] = date.split(separator)
        Number(dateArray[0]) <= new Date().getFullYear() ? correct++ : null
        Number(dateArray[1]) <= 12 ? correct++ : null
        Number(dateArray[2]) <= 31 ? correct++ : null
        Number(dateArray[0]) <= 9 ? dateArray[0] = `0${dateArray[0]}` : null
        Number(dateArray[1]) <= 9 ? dateArray[1] = `0${dateArray[1]}` : null
        Number(dateArray[2]) <= 9 ? dateArray[0] = `0${dateArray[2]}` : null
        return correct == 3 ? true : false
    }
    
    // Case 1
    incluirPerfil(): void {
        const inputName: string = this.requestInput("Nome da pessoa:")
        const inputEmail: string = this.requestInput("Email da pessoa:")
        const newProfile: Perfil = new Perfil(this.redeSocial.repPerfis.lastId, inputName, inputEmail)
        this.redeSocial.incluirPerfil(newProfile)
        this.redeSocial.repPerfis.updateId()
        console.log("Perfil criado!")
        this.hitEnter()
    }
    
    // Case 2
    consultarPerfil(): void {
        const profileId: number = this.requestNumberInput("Informe o id do perfil")
        const query = this.redeSocial.consultarPerfil(profileId, "void", "void")
        console.log(query ? `{ id: ${query.id} nome: ${query.nome} email: ${query.email} }` : "{ }")
        this.hitEnter()
    }
    
    // Case 3
    incluirPostagem(): void {
        const postType: string = this.requestInput("Informe o tipo de postagem:\n1. regular\n2. avançada")
        
        // Controllable attributes
        const text: string = this.requestInput("Texto da postagem")
        let today: string
        
        do {
            today = this.requestInput("Informe ano, mês e o dia da postagem (ex: 2023-02-20)")
        } while(!(this.handleDate(today, "-")))
        
        // Main attributes
        const profileId: number = this.requestNumberInput("Id do perfil")
        const profileExists: Perfil = this.redeSocial.repPerfis.consultar(profileId)
        
        if (profileExists) {
            // Regular post
            if (postType == "1") {
                const newPost: Postagem = new Postagem(
                    this.redeSocial.repPosts.lastId, 
                    text, 0, 0, today, profileExists
                )
                
                this.redeSocial.repPosts.incluir(newPost)
                this.redeSocial.repPosts.updateId()
            }
            
            // Advanced Post
            // Ambas precisam de um id vinculado, por isso o mesmo "profileExists" é usado
            else if (postType == "2") {
                const profileHashtags: string[] = []
                const views: number = this.requestNumberInput("Defina uma qtd. limite de views p/ a postagem")
                const hashTagsAmount: number = this.requestNumberInput("Informe a qtd. de hashtags")
                
                for (let i = 0; i < hashTagsAmount; i++) {
                    let hashtag: string = this.requestInput(`Nome da ${i + 1}a hashtag`)
                    profileHashtags.push("#" + hashtag)
                }

                const newPost: PostagemAvancada = new PostagemAvancada(
                    this.redeSocial.repPosts.lastId, 
                    text, 0, 0, today, profileExists, profileHashtags, views
                )

                this.redeSocial.repPosts.incluir(newPost)
                this.redeSocial.repPosts.updateId()
            }
        }
        console.log("Postagem criada!")
        this.hitEnter()
    }

    // Case 4
    consultarPostagem(): void {
        const postType: string = this.requestInput("Informe o tipo da postagem:\n1. regular\n2. avançada")
        
        // Regular post
        if (postType === "1") {
            const profileId: number = this.requestNumberInput("Informe o id do perfil dessa postagem")
            const query: Postagem[] = this.redeSocial.consultarPostagens(
                profileId, this.mockPost.texto, "void", this.mockProfile
            )
            query ? this.showSpecificPosts(query) : `{ }`
        }
        // Advanced post
        else {
            const hashtag: string = this.requestInput("Informe a hashtag dessa postagem")
            const query: Postagem[] = this.redeSocial.consultarPostagens(
                this.mockProfile.id, this.mockPost.texto, hashtag, this.mockProfile
            )
            query ? this.showSpecificPosts(query) : `{ }`
        }
    }

    // Case 5
    curtir(): void {
        const postId: number = this.requestNumberInput("Informe o id da postagem")  
        this.redeSocial.curtir(postId)
        console.log("Postagem curtida!")
        this.hitEnter()
    }

    // Case 6
    descurtir(): void {
        const postId: number = this.requestNumberInput("Informe o id da postagem")  
        this.redeSocial.descurtir(postId)
        console.log("Postagem descurtida!")
        this.hitEnter()
    }

    // Case 7
    decrementarViews(): void {
        const searchType: string = this.requestInput("Informe sua forma de procura:\n1. id de perfil\n2. hashtag")
        let query: Postagem[]
        
        /*
            It is only possible to decrease views from advanced posts
            but both of them have profile id linked to them
            so there must be two types of options to reach these posts
            at the end, the query will reduce the views from the advanced ones
        */
        if (searchType === "1") {
            const profileId: number = this.requestNumberInput("Informe o id do perfil dessa postagem")
            query = this.redeSocial.consultarPostagens(
                profileId, this.mockPost.texto, "void", this.mockProfile
            )
        }
        else {
            const hashtag: string = this.requestInput("Informe a hashtag dessa postagem")
            query = this.redeSocial.consultarPostagens(
                this.mockProfile.id, this.mockPost.texto, hashtag, this.mockProfile
            )
        }

        // Reduce views from the ones that are advanced posts befora showing the results
        query.forEach(i => {
            i instanceof PostagemAvancada ? this.redeSocial.decrementarVisualizacoes(i) : null
        })

        // Show all posts found within this profile's id range
        console.log("===== POSTAGENS ENCONTRADAS =====")
        query ? this.showSpecificPosts(query) : `{ }`
        this.hitEnter()
    }

    /*
    ===== ISSUE =====
    There were changes at "exibirPostagensPorHashtag" from "RedeSocial" class
    There were changes at "exibirPostagensPorPerfil" from "RedeSocial" class
    Decrementing views at inside these functions (as asked) seems inaccurate 
    The functions previous behavior decreased views before their exhibition
    What is the matter? Let us suppose that one advanced post has been found and has 1 view left
    This leads to a behavior that even though it has 1 view left, it'll turn into 0 before being shown
    Conclusion? It won't be shown
    Solution? shift the reducing behavior from the main function to their cases (8 and 9)
    */

    // Case 8
    exibirPostagensPorPerfil(): void {
        const profileId: number = this.requestNumberInput("Informe o id do perfil dessa postagem")
        const postsFound: Postagem[] = this.redeSocial.exibirPostagensPorPerfil(profileId)
        console.log(postsFound)
        // Decreasing views after results are displayed
        postsFound.forEach(i => {i instanceof PostagemAvancada ? this.redeSocial.decrementarVisualizacoes(i) : null})
        this.hitEnter()
    }

    // Case 9
    exibirPostagensPorhashtag(): void {
        const hashtag: string = this.requestInput("Informe a hashtag")
        const postsFound: Postagem[] = this.redeSocial.exibirPostagensPorHashtag(hashtag)
        console.log(postsFound)
        // Decreasing views after results are displayed
        postsFound.forEach(i => {i instanceof PostagemAvancada ? this.redeSocial.decrementarVisualizacoes(i) : null})
        this.hitEnter()
    }

    removeAdvancedPostsWithoutViews(): void {
        for (let i = 0; i < this.redeSocial.repPosts.postagens.length; i++) {
            const p: Postagem = this.redeSocial.repPosts.postagens[i]
            p instanceof PostagemAvancada && p.visualizacoesRestantes == 0 
            ?  this.redeSocial.repPosts.postagens.splice(i, 1)
            : null
        }
    }
}

/* ========== QUESTÃO 8 ==========
    Implemente as funcionalidades:
    -> Exibir as postagens populares que ainda podem ser exibidas
    -> Exibir as hashtags mais populares, ou seja, as que estão presentes em mais postagens
    
    -> Uma possibilidade é refatorar toda a aplicação a classe para ter um array de classes Hashtag 
    na classe PostagemAvançada, onde ao cadastrar uma postagem pela rede social, as hashtags sejam 
    cadastradas e um contador de cada uma seja atualizado.
    
    -> funcionalidades na classe App além das solicitadas.
*/
