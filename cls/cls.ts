

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
        this.curtidas++
    }

    descurtir(): void {
        this.curtidas--
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
    
    // Check if a certain advanced post has in its "hashtags" attrib. the hashtag passed
    adicionarHashtag(hashtag: string): void {
        if (this.existeHashtag(hashtag)) {
            console.log(new Messages().msg.warn)
            console.log(new Messages().msg.fail.hashtagExists)
            return
        } 
        console.log(new Messages().msg.warn)
        console.log(new Messages().msg.success.hashtagAdded)
        this.hashtags.push(hashtag)
    }

    existeHashtag(hashtag: string): boolean {
        return this.hashtags.includes(hashtag) ? true : false
    }
    
    // For when a post is viewed (but not on all cases) (the post is not chosen and its view removed)
    decrementarVisualizacoes(): void {
        this.visualizacoesRestantes = this.visualizacoesRestantes - 1
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
    
    /*
        It is being asked to return "null", but I do not know how to do it in a way professor wants
        It will return undefined instead
    */
    consultar(id: number): Perfil {
        let searchedProfile!: Perfil
        for (let i = 0; i < this.perfis.length; i++) {
            if (id == this.perfis[i].id) {
                return this.perfis[i]
            }
        }
        return searchedProfile
    }
    
    /*
        After each new profile added, this value will track the history of indexes record
       "txt/last_id_profile.txt" file will make use of it
    */
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

    /*
        After each new post added, this value will track the history of indexes record
       "txt/last_id_post.txt" file will make use of it
    */
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
            this.operation = this.requestInput(new Messages().msg.inputs.askOperationValue)
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
        console.log(new Messages().msg.warn)
        console.log(new Messages().msg.success.appClosed)
    }

    retrieveProfileLastId(): void {
        this.redeSocial.repPerfis.lastId = Number(this.profileLastId.read())
    }

    retrievePostLastId(): void {
        this.redeSocial.repPosts.lastId = Number(this.postLastId.read())
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
        12. Postagens mais populares
        13. Hashtags mais populares

        ===== EDITAR =====
        14. adicionar hashtag
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

    // Auxiliar
    removeAdvancedPostsWithoutViews(): void {
        for (let i = 0; i < this.redeSocial.repPosts.postagens.length; i++) {
            const p: Postagem = this.redeSocial.repPosts.postagens[i]
            p instanceof PostagemAvancada && p.visualizacoesRestantes == 0 
            ?  this.redeSocial.repPosts.postagens.splice(i, 1)
            : null
        }
    }
    
    recordProfileLastId(): void {
        this.profileLastId.content = `${this.redeSocial.repPerfis.lastId}`
        this.profileLastId.write()
    }

    wipeOldProfileData(): void {
        this.profilesTxt.content = ""
        this.profilesTxt.write()
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

    recordPostsLastId(): void {
        this.postLastId.content = `${this.redeSocial.repPosts.lastId}`
        this.postLastId.write()
    }

    wipeOldPostData(): void {
        this.postsTxt.content = ""
        this.postsTxt.write()
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

    hitEnter(): void {
        this.requestInput(new Messages().msg.inputs.pressEnter, true)
    }
    
    // Cases
    conditionals(): void {
        switch(this.operation) {
            case "1":
                console.log(new Messages().msg.operations.includeProfile)
                this.incluirPerfil()
                break
            case "2":
                console.log(new Messages().msg.operations.searchProfile)
                this.consultarPerfil()
                break
            case "3":
                console.log(new Messages().msg.operations.includePost)
                this.incluirPostagem()
                break
            case "4":
                console.log(new Messages().msg.operations.queryPost)
                this.consultarPostagem()
                break
            case "5":
                console.log(new Messages().msg.operations.likePost)
                this.curtir()
                break
            case "6":
                console.log(new Messages().msg.operations.unlikePost)
                this.descurtir()
                break
            case "7":
                console.log(new Messages().msg.operations.lessView)
                this.decrementarViews()
                break
            case "8":
                console.log(new Messages().msg.operations.showPostsByProfile)
                this.exibirPostagensPorPerfil()
                break
            case "9":
                console.log(new Messages().msg.operations.showPostsByHashtag)
                this.exibirPostagensPorhashtag()
                break
            case "10":
                console.log(new Messages().msg.operations.showProfileRepository)
                this.viewProfiles()
                break
            case "11":
                console.log(new Messages().msg.operations.showPostsRepository)
                this.viewPosts()
                break
            case "12":
                console.log(new Messages().msg.operations.queryMostPopularPosts)
                const popularPosts: Postagem[] = this.getMostPopularPosts()
                console.log(popularPosts)
                this.decrementarViewsAposExibir(popularPosts)
                this.hitEnter()
                break
            case "13":
                console.log(new Messages().msg.operations.queryMostPopularHashtags)
                const mostPopularPosts: Postagem[][] = this.getMostPopularHashtags()
                mostPopularPosts.forEach((i:Postagem[], pos) => {
                    this.showSpecificPosts(mostPopularPosts[pos])
                    this.decrementarViewsAposExibir(mostPopularPosts[pos])
                })
                this.hitEnter()
                break
            case "14":
                this.addHashtag()
                break
            default:
                console.log(new Messages().msg.fail.invalidOptionsMainSwitch)
        }
    }

    // Case 1
    incluirPerfil(): void {
        const inputName: string = this.requestInput(new Messages().msg.inputs.askPersonName)
        const inputEmail: string = this.requestInput(new Messages().msg.inputs.askPersonEmail)
        const newProfile: Perfil = new Perfil(this.redeSocial.repPerfis.lastId, inputName, inputEmail)
        this.redeSocial.incluirPerfil(newProfile)
        this.redeSocial.repPerfis.updateId()
        this.hitEnter()
    }
    
    // Case 2
    consultarPerfil(): void {
        const profileId: number = this.requestNumberInput(new Messages().msg.inputs.askProfileId)
        const query = this.redeSocial.consultarPerfil(profileId, "void", "void")
        console.log(query ? `{ id: ${query.id} nome: ${query.nome} email: ${query.email} }` : "{ }")
        this.hitEnter()
    }
    
    // Case 3
    incluirPostagem(): void {
        const postType: string = this.requestInput(new Messages().msg.inputs.askPostType)
        
        // Controllable attributes
        const text: string = this.requestInput(new Messages().msg.inputs.askPostContent)
        let today: string
        
        do {
            today = this.requestInput(new Messages().msg.inputs.askDateAsTutorial)
        } while(!(this.handleDate(today, "-")))
        
        // Main attributes
        const profileId: number = this.requestNumberInput(new Messages().msg.inputs.askProfileId)
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
                const views: number = this.requestNumberInput(new Messages().msg.inputs.askPostViewsRange)
                const hashTagsAmount: number = this.requestNumberInput(new Messages().msg.inputs.askHashtagsAmount)
                
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

        this.hitEnter()
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

    // Case 4
    consultarPostagem(): void {
        const postType: string = this.requestInput(new Messages().msg.inputs.askPostType)
        
        // Regular post
        if (postType === "1") {
            const profileId: number = this.requestNumberInput(new Messages().msg.inputs.askProfileId)
            const query: Postagem[] = this.redeSocial.consultarPostagens(
                profileId, this.mockPost.texto, "void", this.mockProfile
            )
            query ? this.showSpecificPosts(query) : `{ }`
        }
        // Advanced post
        else {
            const hashtag: string = this.requestInput(new Messages().msg.inputs.askHashtagContent)
            const query: Postagem[] = this.redeSocial.consultarPostagens(
                this.mockProfile.id, this.mockPost.texto, hashtag, this.mockProfile
            )
            query ? this.showSpecificPosts(query) : `{ }`
        }
        this.hitEnter()
    }

    // Case 5
    curtir(): void {
        const postId: number = this.requestNumberInput(new Messages().msg.inputs.askPostId)  
        this.redeSocial.curtir(postId)
        this.hitEnter()
    }

    // Case 6
    descurtir(): void {
        const postId: number = this.requestNumberInput(new Messages().msg.inputs.askPostId)  
        this.redeSocial.descurtir(postId)
        this.hitEnter()
    }

    // Case 7
    decrementarViews(): void {
        const searchType: string = this.requestInput(new Messages().msg.inputs.askSearchingMethod)
        let query: Postagem[]
        
        /*
            It is only possible to decrease views from advanced posts
            but both of them have profile id linked to them
            so there must be two types of options to reach these posts
            at the end, the query will reduce the views from the advanced ones
        */
        if (searchType === "1") {
            const profileId: number = this.requestNumberInput(new Messages().msg.inputs.askProfileId)
            query = this.redeSocial.consultarPostagens(
                profileId, this.mockPost.texto, "void", this.mockProfile
            )
        }
        else {
            const hashtag: string = this.requestInput(new Messages().msg.inputs.askHashtagContent)
            query = this.redeSocial.consultarPostagens(
                this.mockProfile.id, this.mockPost.texto, hashtag, this.mockProfile
            )
        }

        // Show all posts found within this profile's id range
        console.log(new Messages().msg.success.postsFound)
        query ? this.showSpecificPosts(query) : `{ }`

        // Reduce views from the ones that are advanced posts after showing the results
        this.decrementarViewsAposExibir(query)
        // query.forEach(i => {
        //     i instanceof PostagemAvancada ? this.redeSocial.decrementarVisualizacoes(i) : null
        // })

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
        const profileId: number = this.requestNumberInput(new Messages().msg.inputs.askProfileId)
        const postsFound: Postagem[] = this.redeSocial.exibirPostagensPorPerfil(profileId)
        console.log(postsFound)
        // Decreasing views after results are displayed
        // postsFound.forEach(i => {i instanceof PostagemAvancada ? this.redeSocial.decrementarVisualizacoes(i) : null})
        this.decrementarViewsAposExibir(postsFound)
        this.hitEnter()
    }

    // Case 9
    exibirPostagensPorhashtag(): void {
        const hashtag: string = this.requestInput(new Messages().msg.inputs.askHashtagContent)
        const postsFound: Postagem[] = this.redeSocial.exibirPostagensPorHashtag(hashtag)
        console.log(postsFound)
        // Decreasing views after results are displayed
        // postsFound.forEach(i => {i instanceof PostagemAvancada ? this.redeSocial.decrementarVisualizacoes(i) : null})
        this.decrementarViewsAposExibir(postsFound)
        this.hitEnter()
    }

    // Case 10
    viewProfiles(): void {
        console.log("Perfis registrados", this.getProfileDatabaseSize())
        this.showProfileDatabase()
        this.hitEnter()
    }

    showProfileDatabase(): void {
        console.log("\n[")
        for(let i = 0; i < this.getProfileDatabaseSize(); i++) {
            const thisProfile = this.redeSocial.repPerfis.perfis[i]
            console.log(thisProfile)
        }
        console.log("]")
    }
    
    // Case 11
    viewPosts(): void {
        console.log("Postagens registradas", this.getPostsDatabaseSize())
        this.showPostsDatabase()
        this.hitEnter()
    }

    showPostsDatabase(): void {
        console.log("\n[")
        for(let i = 0; i < this.getPostsDatabaseSize(); i++) {
            const thisPost: Postagem = this.redeSocial.repPosts.postagens[i] 
            console.log(thisPost)
        }
        console.log("]")
    }

    // Case 12
    getMostPopularPosts(): Postagem[] {
        const rankAmount: number = this.requestNumberInput(new Messages().msg.inputs.askPostAmountForRank)
        
        let advancedPosts: Postagem[] = this.redeSocial.repPosts.postagens.filter((i: Postagem) => {
            if (i instanceof PostagemAvancada) {
                return true
            }
            return false
        })
        
        advancedPosts.sort((a: Postagem, b: Postagem) => {
            if (a instanceof PostagemAvancada && b instanceof PostagemAvancada) {
                return b.visualizacoesRestantes - a.visualizacoesRestantes
            }
            return 0
        })
        
        // There is a slice function who does this loop's work, but I chose not to do it
        let popularPosts: Postagem[] = []
        for (let i = 0; i < rankAmount; i++) {
            popularPosts.push(advancedPosts[i])
        }

        return popularPosts
    }

    // Case 13
    getMostPopularHashtags(): PostagemAvancada[][] {
        const rankAmount: number = this.requestNumberInput(new Messages().msg.inputs.askHashtagAmountForRank)
        const hashtagsBoxNonUnique: string[] = this.getAdvancedPostsHashtags(this.getAdvancedPosts())
        const hashtagsBox: Hashtag = new Hashtag(hashtagsBoxNonUnique)
        const hashtagsBoxUnique: string[] = hashtagsBox.filterUniqueHashtags()
        const hashtagsCountageRank: [string, number][] = hashtagsBox.sortAscendingOrder()
        const rank: [string, number][] = []

        const overallPopularHashtagPosts: PostagemAvancada[][] = []
        // Put into "rank" the results based on the range the user provided
        // rank = [["#saúde", 4], ["#animais", 3], ["#mundo", 2]]
        for (let i = 0; i < rankAmount; i++) {
            rank.push(hashtagsCountageRank[i])
        }
        for (let i = 0; i < rank.length; i++) {
            const hashtag: string = rank[i][0]
            // overallPopularHashtagPosts.push()
            overallPopularHashtagPosts.push(this.redeSocial.exibirPostagensPorHashtag(hashtag))
        }
        return overallPopularHashtagPosts
    }

    // Auxiliar
    getAdvancedPosts(): PostagemAvancada[] {
        let postsFilter: Postagem[] = this.redeSocial.repPosts.postagens.filter((i: Postagem) => {
            if (i instanceof PostagemAvancada) {
                return true
            }
            return false
        })
        // This is done to avoid error ts(2322)
        const advancedPosts: PostagemAvancada[] = []
        postsFilter.forEach(i => {i instanceof PostagemAvancada ? advancedPosts.push(i) : null})
        postsFilter = []
        return advancedPosts
    }
    
    // Auxiliar
    getAdvancedPostsHashtags(arrayPosts: PostagemAvancada[]): string[] {
        const arrayHashtags: string[] = []
        for (let i = 0; i < arrayPosts.length; i++) {
            // Add each hashtag [j] from each index of arrayPosts [i]
            for (let j = 0; j < arrayPosts[i].hashtags.length; j++) {
                arrayHashtags.push(arrayPosts[i].hashtags[j])
            }
        }
        return arrayHashtags
    }

    showSpecificPosts(arrayPosts: Postagem[]): void {
        console.log("\n[")
        for (let i = 0; i < arrayPosts.length; i++) {
            const thisPost: Postagem = arrayPosts[i]
            console.log(thisPost)
        }
        console.log("]")
    }

    getProfileDatabaseSize(): number {
        return this.redeSocial.repPerfis.perfis.length
    }

    getPostsDatabaseSize(): number {
        return this.redeSocial.repPosts.postagens.length
    }
    
    decrementarViewsAposExibir(array: Postagem[]) {
        array.forEach(i => {
            i instanceof PostagemAvancada ? this.redeSocial.decrementarVisualizacoes(i) : null
        })
    }

    addHashtag(): void {
        const profileId: number = this.requestNumberInput(new Messages().msg.inputs.askProfileId)
        const postsFromThisProfile: Postagem[] = this.redeSocial.repPosts.consultar(profileId, this.mockAdvancedPost.hashtags[0])
        
        const idList: number[] = []
        postsFromThisProfile.forEach((i: Postagem) => {i instanceof PostagemAvancada ? idList.push(i.id) : null})
        
        console.log(postsFromThisProfile)
        console.log(new Messages().msg.tutorial.askWhichId, "\n", idList)
        const advancedPostId: number = this.requestNumberInput(new Messages().msg.inputs.choosePostId)
        
        idList.forEach((i: number) => {
            if (advancedPostId === i) {
                const newHashtag: string = this.requestInput(new Messages().msg.inputs.askHashtagContent)
                const newPost = this.redeSocial.repPosts.postagens[i]
                if (newPost instanceof PostagemAvancada) {
                    (<PostagemAvancada> newPost).adicionarHashtag(newHashtag)
                }
                console.log(newPost)
            }
        })
        this.hitEnter()
    }
}

export class Hashtag {
    private _hashBox: string[]
    private _uniqueHashBox: string[]
    private _countageReport: [string, number][] = []
    
    constructor(hashBox: string[]) {
        this._hashBox = hashBox
        this._uniqueHashBox = []
        this._countageReport = []
    }

    get hashBox(): string[] {
        return this._hashBox
    }

    set hashBox(newValue) {
        this._hashBox = newValue
    }

    get uniqueHashBox(): string[] {
        return this._uniqueHashBox
    }

    set uniqueHashBox(newValue) {
        this._uniqueHashBox = newValue
    }

    get countageReport(): [string, number][] {
        return this._countageReport
    }

    filterUniqueHashtags(): string[] {
        this.uniqueHashBox = this.hashBox.filter((i: string, pos: number, array: string[]) => {
            if (array.indexOf(i) === pos) {
                return true
            }
        })
        return this.uniqueHashBox
    }

    countEachHashtag(): [string, number][] {
        const report: [string, number][] = [];
      
        this.uniqueHashBox.forEach((i, pos) => {
            report[pos] = [i, 0]
        })
    
        this.hashBox.forEach((i) => {
            if (this.uniqueHashBox.includes(i)) {
                report[this.uniqueHashBox.indexOf(i)][1]++
            }
        })
        
        return report
    }
    
    sortAscendingOrder(): [string, number][] {
        const hashtagsSortedAscending: [string, number][] = this.countEachHashtag().sort((i: [string, number], i2: [string, number]) => {
            if (i2[1] < i[1]) {
                return -1  
            } else if (i2[1] > i[1]) {
                return 1  
            } else {
                return 0   
            }
        })
        return hashtagsSortedAscending
    }
}

export class Messages {
    msg

    constructor() {
        this.msg = {
            warn: "\n===== AVISO =====",
            operations: {
                includeProfile: "===== OPERAÇÃO 1: INCLUSÃO DE PERFIL =====",
                searchProfile: "===== OPERAÇÃO 2: PROCURAR PERFIL =====",
                includePost: "===== OPERAÇÃO 3: INCLUSÃO DE POSTAGEM =====",
                queryPost: "===== OPERAÇÃO 4: CONSULTA DE POSTAGEM =====",
                likePost: "===== OPERAÇÃO 5: CURTIR POSTAGEM =====",
                unlikePost: "===== OPERAÇÃO 6: DESCURTIR POSTAGEM =====",
                lessView: "===== OPERAÇÃO 7: DECREMENTAR VIEWS =====",
                showPostsByProfile: "===== OPERAÇÃO 8: EXIBIR POSTAGENS POR PERFIL =====",
                showPostsByHashtag: "===== OPERAÇÃO 9: EXIBIR POSTAGENS POR HASHTAG =====",
                showProfileRepository: "===== OPERAÇÃO 10: VER BANCO DE PERFIS =====",
                showPostsRepository: "===== OPERAÇÃO 11: VER BANCO DE POSTAGENS =====",
                queryMostPopularPosts: "===== OPERAÇÃO 12: CONSULTAR POSTS MAIS POPULARES ======",
                queryMostPopularHashtags: "===== OPERAÇÃO 13: CONSULTAR HASHTAGS MAIS POPULARES =====",
            },
            success: {
                appClosed: "Aplicação encerrada!\n",
                postsFound: "===== POSTAGENS ENCONTRADAS =====",
                hashtagAdded: "Hashtag adicionada!\n"
            },
            fail: {
                invalidOptionsMainSwitch: "Opções permitidas: 1 a 11!\n",
                hashtagExists: "Hashtag repetida detectada!\n"
            },
            inputs: {
                pressEnter: "\n>>> Pressione ENTER <<<",
                askOperationValue: "Digite o valor da operação",
                askPersonName: "Nome da pessoa:",
                askPersonEmail: "Email da pessoa:",
                askProfileId: "Informe o id do perfil",
                askPostType: "Informe o tipo de postagem:\n1. regular\n2. avançada",
                askPostContent: "Texto da postagem",
                askDateAsTutorial: "Informe ano, mês e o dia da postagem (ex: 2023-02-20)",
                askPostViewsRange: "Defina uma qtd. limite de views p/ a postagem",
                askHashtagsAmount: "Informe a qtd. de hashtags",
                askHashtagContent: "Informe a hashtag dessa postagem",
                askPostId: "Informe o id da postagem dessa postagem",
                askSearchingMethod: "Informe sua forma de procura:\n1. id de perfil\n2. hashtag",
                askPostAmountForRank: "Informe a qtd. de posts para fazer o rank",
                askHashtagAmountForRank: "Informe a qtd. de hashtags para fazer o rank",
                choosePostId: "Escolha e informe o id da postagem a receber nova hashtag",
            },
            tutorial: {
                askWhichId: "\nEscolha entre os id aquele que deseja add uma hashtag: "
            }
        }
    }
}
